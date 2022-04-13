var wallet = require("./wallet");
var nodes = require("./nodes");
var lightning = require("./lightning");
var bitcoind = require("./bitcoind");

const CENTRAL = "alice";

async function createOrUnlockWallet(node) {
  console.log("[LND] setup");
  try {
    const r = await wallet.initWallet(node);
    console.log("[LND] INIT WALLET");

    //code is the "wallet already exisits" code there is also an error message in r
    // we go into this block of code if we've already initialized a wallet for the node
    if (r.code === 2) {
      // first mine blocks
      await bitcoind.mine(6, "bcrt1qsrq4qj4zgwyj8hpsnpgeeh0p0aqfe5vqhv7yrr");
      const r2 = await wallet.unlockWallet(node);
      console.log("[LND] WALLET UNLOCKED");
    }
  } catch (e) {
    console.log("=> err", e);
  }
}

async function coinsAndChannels(node) {
  try {
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
    console.log("=> ALICE confirmed balance:", confirmed);
    if (!confirmed) {
      const ares = await lightning.newAddress(node);
      const addy = ares.address;
      console.log("=> ALICE address", addy);
      await bitcoind.mine(101, addy);
      console.log("=> 101 blocks mined to alice!", addy);
      await sleep(5000);
    }
    return true;
  } catch (e) {
    console.log("=> err:", e);
  }
}

async function channels(node) {
  try {
    const ps = await lightning.listPeers(node);
    const peers = ps.peers;
    const peersToMake = node.channels
      ? node.channels.filter((ch) => {
          const exists = peers.find((p) => p.pub_key === ch.pubkey);
          return exists ? false : true;
        })
      : [];
    await asyncForEach(peersToMake, async (p) => {
      await lightning.addPeer(node, p);
    });

    const chans = await lightning.listChannels(node);
    const channels = chans.channels || [];
    if (!channels.length) {
      console.log("=> alice opening channels...");
      // open channels here
      await asyncForEach(peersToMake, async (p) => {
        await lightning.openChannel(node, {
          pubkey: p.pubkey,
          amount: 2000000,
          push_amount: 1000000,
        });
      });
      await bitcoind.mine(6, "bcrt1qsrq4qj4zgwyj8hpsnpgeeh0p0aqfe5vqhv7yrr");
      console.log("=> 6 blocked mined to Alice!");
    }
    await sleep(4000);
    const chans2 = await lightning.listChannels(node);
    console.log("FINAL CHANS", chans2.channels);
  } catch (e) {
    console.log("=> err:", e);
  }
}

async function unlockAll() {
  await sleep(3500);
  // createOrUnlockWallet(nodes.nodes.alice);
  await asyncForEach(Object.values(nodes.nodes), async (node) => {
    await createOrUnlockWallet(node);
  });
  await sleep(5000);
  await coinsAndChannels(nodes.nodes.alice);
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
