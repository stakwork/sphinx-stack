var wallet = require("./wallet");
var nodes = require("./nodes");
var lightning = require("./lightning");
var bitcoind = require("./bitcoind");

if (process.env.PROXY === "true") {
  console.log("test proxy nodes!");
  nodes = require("./nodes/proxynodes");
}

if (process.env.CLN_PROXY === "true") {
  console.log("test cln proxy nodes!");
  nodes = require("./nodes/clnProxyNodes");
}
// if (process.env.DAVE_IP) {
//   if (nodes.nodes["dave"]) {
//     nodes.nodes["dave"].hostname = process.env.DAVE_IP;
//   }
// }

async function createOrUnlockWallet(node) {
  if (node.type === "lnd") {
    console.log("[LND] setup", node.alias);
    try {
      const r = await wallet.initWallet(node);
      console.log("[LND] INIT WALLET", node.alias);

      //code is the "wallet already exisits" code there is also an error message in r
      // we go into this block of code if we've already initialized a wallet for the node
      if (r.code === 2) {
        // first mine blocks
        await bitcoind.mine(6, "bcrt1qsrq4qj4zgwyj8hpsnpgeeh0p0aqfe5vqhv7yrr");
        const r2 = await wallet.unlockWallet(node);
        console.log("[LND] WALLET UNLOCKED", node.alias);
      }
    } catch (e) {
      console.log("=> err", e);
    }
  }
}

async function coins(node) {
  try {
    const balres = await lightning.getBalance(node);
    const confirmed = parseInt(balres.confirmed_balance);
    console.log(`=> ${node.alias} confirmed balance:`, confirmed);
    if (confirmed < 100000000) {
      const addr = (await lightning.newAddress(node)).address;
      console.log(`=> ${node.alias} address`, addr);
      await bitcoind.mine(1, addr);
      console.log(`=> 1 block mined to ${node.alias}!`);
    }
    return true;
  } catch (e) {
    console.log("=> coins error:", e);
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

    console.log("peers to make:", peersToMake);

    if (!peersToMake.length) {
      console.log(`=> ${node.alias} doesn't need to open channels`);
      return;
    }

    await asyncForEach(peersToMake, async (p) => {
      await lightning.addPeer(node, p);
    });

    const chans = await lightning.listChannels(node);
    const channels = chans.channels || [];
    if (channels.length) {
      console.log(`=> ${node.alias} already has open channels`);
    } else {
      console.log(`=> ${node.alias} opening ${peersToMake.length} channels...`);
      await asyncForEach(peersToMake, async (p) => {
        console.log("open channel with:", p);

        //create a small channel for bob, to ensure sats reversal works
        if (
          p.pubkey ===
          "02a38857848aca6b32ebcc3c85d07ee41354988f4f1e0b4e6ccd255eee6ed75b8d"
        ) {
          await lightning.openChannel(node, {
            pubkey: p.pubkey,
            amount: 1000000,
            push_amount: 500000,
          });
        } else {
          await lightning.openChannel(node, {
            pubkey: p.pubkey,
            amount: 2000000,
            push_amount: 1000000,
          });
        }
      });
    }
  } catch (e) {
    console.log("=> channels error:", e);
  }
}

async function logChannels(node) {
  try {
    const chans = await lightning.listChannels(node);
    console.log(
      `=> ${node.alias} has ${chans.channels.length} channels:`,
      chans.channels.map(ch => ch.remote_pubkey)
    );
  } catch (e) {
    console.log("=> logChannels err:", e);
  }
}

async function unlockAll() {
  await sleep(3500);

  await forEachNode(createOrUnlockWallet);

  await sleep(5000);

  await forEachNode(coins);

  // coinbase outputs need 100 confs
  await bitcoind.mine(100, "bcrt1qsrq4qj4zgwyj8hpsnpgeeh0p0aqfe5vqhv7yrr");
  await sleep(5000);

  await forEachNode(channels);

  // ln channels need at most 6 confs
  await bitcoind.mine(6, "bcrt1qsrq4qj4zgwyj8hpsnpgeeh0p0aqfe5vqhv7yrr");

  await sleep(20000);

  await forEachNode(logChannels);
}

unlockAll();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function forEachNode(callback) {
  await asyncForEach(Object.values(nodes.nodes), callback);
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
