var routes = require("./routes");
var nodes = require("./nodes");

async function createOrUnlockWallet() {
  console.log("=====> try to setup alice lnd <======");
  try {
    const r = await routes.initWallet(nodes.nodes.alice);
    console.log("r", r);
    if (r.error) {
      // r.error === "wallet already exists"
      const r2 = await routes.unlockWallet(nodes.nodes.alice);
      console.log("r2", r2);
    }
  } catch (e) {
    console.log("=> err", e);
  }
}

async function unlockAll() {
  await sleep(5000);
  await createOrUnlockWallet();
}

unlockAll();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
