var fetch = require("./fetch");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "xyzxyzxyz";
var fs = require("fs");
var paths = require("./paths");

async function collect_contact(external_ip) {
  const ip = external_ip.replace("localhost", "host.docker.internal");
  const ci = await get(ip, "account");
  const arr = ci.contact_info.split("_");
  return {
    pubkey: arr[0],
    routeHint: `${arr[1]}_${arr[2]}`,
    alias: ci.alias,
    ip,
    external_ip,
    adminToken: ADMIN_TOKEN,
    v2: true,
  };
}

async function setup() {
  await sleep(30000);

  const ALICE = "http://localhost:3005";
  const BOB = "http://localhost:3006";

  const alice = await collect_contact(ALICE);
  const bob = await collect_contact(BOB);

  const nodes = [alice, bob];
  const jsonString = JSON.stringify(nodes, null, 2);
  console.log(nodes);

  console.log("this is what we're writing", jsonString);
  fs.writeFileSync(paths.pathToWrite, jsonString);

  console.log("======================================");
  console.log("==                                  ==");
  console.log("==      =>  SETUP COMPLETE!  <=     ==");
  console.log("==                                  ==");
  console.log("======================================");
}
setup();

async function post(root, path, body) {
  const headers = {
    "Content-Type": "application/json",
  };
  headers["x-admin-token"] = ADMIN_TOKEN;
  const r = await fetch(root + "/" + path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const j = await r.json();
  return j;
}

async function get(root, path) {
  const headers = {};
  headers["x-admin-token"] = ADMIN_TOKEN;
  const r = await fetch(root + "/" + path, {
    method: "GET",
    headers,
  });
  const j = await r.json();
  return j;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
