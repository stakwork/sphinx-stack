var wallet = require("./wallet");
var nodes = require("./nodes");

async function createOrUnlockWallet(node) {
  console.log("=====> try to setup alice lnd <======");
  try {
    const r = await wallet.initWallet(node);
    console.log("r", r);
    if (r.error) {
      // r.error === "wallet already exists"
      const r2 = await wallet.unlockWallet(node);
      console.log("r2", r2);
    }
  } catch (e) {
    console.log("=> err", e);
  }
}

async function unlockAll() {
  await sleep(5000);
  await asyncForEach(Object.values(nodes.nodes), async (node) => {
    await createOrUnlockWallet(node);
  });
}

unlockAll();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
