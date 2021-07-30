var grpc = require("./grpc");

async function createOrUnlockWallet(name) {
  console.log("=====> try to setup alice lnd <======");
  try {
    // const opts = {
    //   tls_location: `../${name}-lnd/.lnd/tls.cert`,
    //   lnd_ip: "127.0.0.1:10009",
    //   macaroon_location: `../${name}-lnd/.lnd/data/chain/bitcoin/regtest/admin.macaroon`,
    // };
    var opts = {
      tls_location: `../lnd-data/alice/.lnd/tls.cert`,
      lnd_ip: "127.0.0.1:10009",
      macaroon_location: `../lnd-data/alice/.lnd/data/chain/bitcoin/regtest/admin.macaroon`,
    };
    const pass = `${name}12345`;
    const r = await grpc.unlockWallet(pass, opts);
    console.log(r);
  } catch (e) {
    console.log("=> err", e);
  }
}

async function unlockAll() {
  await sleep(5000);
  await createOrUnlockWallet("alice");
}

unlockAll();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
