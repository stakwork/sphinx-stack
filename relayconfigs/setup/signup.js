const Crypto = require("crypto");
var fs = require("fs");
var rsa = require("./rsa");
var fetch = require("./fetch");
var JSCryptor = require("./rncryptor");

const path = "/relayconfigs/_nodes_partial.json";
const pathToWrite = "/relayconfigs/_nodes_full.json";

const CLEAR = false;

async function run_signup() {
  var nodes1 = require(path);
  var finalNodes = require(pathToWrite);
  await asyncForEach(nodes1, async (n, i) => {
    if (finalNodes[i].authToken) return; // ALREADY SIGNED UP!
    const token = await signup(n);
    n.authToken = token;
    await createContactKey(n);
  });

  if (!CLEAR) return;
  var nodesAgain = require(path);
  await asyncForEach(nodesAgain, async (n) => {
    await clearNode(n);
  });
}

function headers(token) {
  const h = { "Content-Type": "application/json" };
  if (token) h["x-user-token"] = token;
  return h;
}

async function signup(n) {
  try {
    const token = Crypto.randomBytes(20).toString("base64").slice(0, 20);
    const r = await fetch(n.ip + "/contacts/tokens", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        token,
        pubkey: n.pubkey,
      }),
    });
    const json = await r.json();
    console.log("signed up: ", json);

    addFieldToNodeJson(n.pubkey, "authToken", token);

    return token;
  } catch (e) {
    console.log(e);
  }
}

async function getOwner(n) {
  const r = await fetch(n.ip + "/contacts", {
    method: "GET",
    headers: headers(n.authToken),
  });
  const j = await r.json();

  const owner = j.response.contacts.find((c) => c.is_owner);
  // const id = owner.id;
  return owner;
}

async function createContactKey(n) {
  // console.log("NODE",n)

  const owner = await getOwner(n);
  const id = owner.id;

  const { public, private } = await rsa.genKeys();
  addFieldToNodeJson(n.pubkey, "contact_key", public);
  addFieldToNodeJson(n.pubkey, "privkey", private);

  const r = await fetch(n.ip + "/contacts/" + id, {
    method: "PUT",
    headers: headers(n.authToken),
    body: JSON.stringify({
      contact_key: public,
    }),
  });
  const j = await r.json();
  const owner2 = await getOwner(n);

  const str = `${private}::${public}::${n.external_ip}::${n.authToken}`;
  const pin = "111111";
  const enc = JSCryptor.JSCryptor.Encrypt(str, pin);
  const final = Buffer.from(`keys::${enc}`).toString("base64");
  addFieldToNodeJson(n.pubkey, "exported_keys", final);
}

async function clearNode(n) {
  const r2 = await fetch(n.ip + "/test_clear", {
    headers: headers(n.authToken),
  });
  const j2 = await r2.json();
}

async function addFieldToNodeJson(pubkey, key, value) {
  var nodes = require(path);
  const idx = nodes.findIndex((n) => n.pubkey === pubkey);
  if (idx < 0) return;
  nodes[idx][key] = value;
  const jsonString = JSON.stringify(nodes, null, 2);
  fs.writeFileSync(pathToWrite, jsonString);
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = { run_signup };
