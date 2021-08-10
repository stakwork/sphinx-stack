var wallet = require("./wallet");
var nodes = require("./nodes");
var lightning = require("./lightning");
var bitcoind = require("./bitcoind");

async function createOrUnlockWallet(node) {
  console.log("[LND] setup");
  try {
    const r = await wallet.initWallet(node);
    console.log("[LND] INIT WALLET");
    if (r.error) {
      // r.error === "wallet already exists"
      // first mine blocks
      await bitcoind.mine(6, "bcrt1qsrq4qj4zgwyj8hpsnpgeeh0p0aqfe5vqhv7yrr");
      const r2 = await wallet.unlockWallet(node);
      console.log("[LND] WALLET UNLOCKED");
      // console.log("r2", r2);
    }
    await sleep(2000);
    const coins_success = await coins(node);
    if (coins_success) {
      await channels(node);
    }
  } catch (e) {
    console.log("=> err", e);
  }
}

async function coins(node) {
  try {
    const balres = await lightning.getBalance(node);
    const confirmed = parseInt(balres.confirmed_balance);
    console.log("=> confirmed balance:", confirmed);
    if (!confirmed) {
      const ares = await lightning.newAddress(node);
      const addy = ares.address;
      console.log("=> address", addy);
      await bitcoind.mine(101, addy);
      await sleep(5000);
    }
    return true;
  } catch (e) {
    console.log("=> err:", e);
  }
}

async function channels(node) {
  try {
    const chans = await lightning.listChannels(node);
    const channels = chans.channels || [];
    if (!channels.length) {
      // open channels here
    }
  } catch (e) {}
}

async function unlockAll() {
  await sleep(3500);
  createOrUnlockWallet(nodes.nodes.alice);
  // await asyncForEach(Object.values(nodes.nodes), async (node) => {
  //   await createOrUnlockWallet(node);
  // });
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
