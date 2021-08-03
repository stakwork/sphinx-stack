var fetch = require("./fetch");
const https = require("https");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

async function initWallet(node) {
  var root = `https://${node.hostname}/v1/`;
  var pass = Buffer.from(node.password).toString("base64");
  const r = await fetch(root + "initwallet", {
    method: "POST",
    body: JSON.stringify({
      wallet_password: pass,
      cipher_seed_mnemonic: node.mnemonic,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    agent: httpsAgent,
  });
  const j = await r.json();
  return j;
}

async function unlockWallet(node) {
  var root = `https://${node.hostname}/v1/`;
  var pass = Buffer.from(node.password).toString("base64");
  const r = await fetch(root + "unlockwallet", {
    method: "POST",
    body: JSON.stringify({
      wallet_password: pass,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    agent: httpsAgent,
  });
  const j = await r.json();
  return j;
}

module.exports = {
  unlockWallet,
  initWallet,
};
