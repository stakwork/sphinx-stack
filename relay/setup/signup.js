const Crypto = require("crypto");
var fs = require("fs");
var rsa = require("./rsa");
var fetch = require("./fetch");
var JSCryptor = require("./rncryptor");
var paths = require("./paths");

async function run_signup(n, i) {
  try {
    var finalNodes = require(paths.pathToWrite);
    if (finalNodes[i].authToken) return; // ALREADY SIGNED UP!
    const token = await signup(n);
    n = require(paths.pathToWrite)[i];
    n.authToken = token;

    await createContactKey(n);
  } catch (e) {
    console.log(e);
  }
}

function headers(token, transportToken) {
  const h = { "Content-Type": "application/json" };

  if (token && !transportToken) h["x-user-token"] = token;
  if (token && transportToken) {
    h["x-transport-token"] = rsa.encrypt(
      transportToken,
      `${token}|${Date.now()}`
    );
  }
  return h;
}
function proxyHeaders(token) {
  const h = { "Content-Type": "application/json" };
  if (token) h["x-admin-token"] = token;
  return h;
}

async function signup(n) {
  try {
    /*if (n.is_proxy && !n.is_lite_node) {
      let ok = false;
      console.log("about ot enter while loop");
      while (!ok) {
        try {
          await sleep(1000);
          const proxyGenerateUserResponse = await fetch(
            "http://proxy.sphinx:5050/generate",
            {
              method: "POST",
              headers: proxyHeaders("r46bnf8ibrhbb424heba"),
            }
          );
          const proxyGenerateUserResponseJson = await proxyGenerateUserResponse.json();
          addFieldToNodeJson(
            n.pubkey,
            "pubkey",
            proxyGenerateUserResponseJson.pubkey
          );
          addFieldToNodeJson(
            proxyGenerateUserResponseJson.pubkey,
            "is_proxy",
            "false"
          );

          n.pubkey = proxyGenerateUserResponseJson.pubkey;
          if (proxyGenerateUserResponse.ok) ok = true;
        } catch (e) {
          console.log(e);
        }
      }
		}*/

    const token = Crypto.randomBytes(20)
      .toString("base64")
      .slice(0, 20);
    let transportToken = await getTransportToken(n);
    const r = await fetch(n.ip + "/contacts/tokens", {
      method: "POST",
      headers: headers(token, transportToken),
      body: JSON.stringify({
        pubkey: n.pubkey,
      }),
    });
    const json = await r.json();

    addFieldToNodeJson(n.pubkey, "authToken", token);
    /*addFieldToNodeJson(
      n.pubkey,
      "transportToken",
      json.response.transportToken
		);*/
    addFieldToNodeJson(n.pubkey, "transportToken", transportToken);

    return token;
  } catch (e) {
    console.log(e);
  }
}

async function getTransportToken(n) {
  const r = await fetch(n.ip + "/request_transport_key", {
    method: "GET",
    headers: headers(),
  });
  const j = await r.json();
  return j.response.transport_key;
}

async function getOwner(n) {
  console.log("-> getOwner");
  try {
    const transportToken = await getTransportToken(n);
    const r = await fetch(n.ip + "/contacts", {
      method: "GET",
      headers: headers(n.authToken, transportToken),
    });
    if (!r.ok) {
      console.log(await r.text());
      throw new Error("couldnt getOwner");
    }
    const j = await r.json();
    const owner = j.response.contacts.find((c) => c.is_owner);
    // const id = owner.id;
    return owner;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function createContactKey(n) {
  try {
    // console.log("NODE",n)

    const owner = await getOwner(n);
    const id = owner.id;
    console.log("==> Generating keys");
    const { public, private } = await rsa.genKeys();
    console.log("==> Finished Generating keys");

    console.log("THIS IS THE PUB KEY: ", n.pubkey);
    addFieldToNodeJson(n.pubkey, "contact_key", public);
    addFieldToNodeJson(n.pubkey, "privkey", private);

    const r = await fetch(n.ip + "/contacts/" + id, {
      method: "PUT",
      headers: headers(n.authToken),
      body: JSON.stringify({
        contact_key: public,
        alias: n.alias,
      }),
    });
    console.log("===> contacts call finished");
    const j = await r.json();
    const owner2 = await getOwner(n);

    const str = `${private}::${public}::${n.external_ip}::${n.authToken}`;
    const pin = "111111";
    const enc = JSCryptor.JSCryptor.Encrypt(str, pin);
    const final = Buffer.from(`keys::${enc}`).toString("base64");
    console.log("FINAL: ", final);
    addFieldToNodeJson(n.pubkey, "exported_keys", final);

    addFieldToNodeJson(n.pubkey, "pin", pin);
    console.log("===> contacts exchange key call finished");
  } catch (e) {
    console.log(e);
  }
}

async function clearNode(n) {
  const r2 = await fetch(n.ip + "/test_clear", {
    headers: headers(n.authToken, n.transportToken),
  });
  const j2 = await r2.json();
}

async function addFieldToNodeJson(pubkey, key, value) {
  var nodes = require(paths.path);
  const idx = nodes.findIndex((n) => n.pubkey === pubkey);
  if (idx < 0) return;
  nodes[idx][key] = value;
  const jsonString = JSON.stringify(nodes, null, 2);
  fs.writeFileSync(paths.pathToWrite, jsonString);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { run_signup };
