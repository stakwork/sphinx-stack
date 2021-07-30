var fs = require("fs");
var grpc = require("grpc");
var ByteBuffer = require("bytebuffer");

function getMacaroon(opts) {
  let macLocation = opts.macaroon_location;
  const m = fs.readFileSync(macLocation);
  return m.toString("hex");
}

function loadCredentials(opts) {
  var lndCert = fs.readFileSync(opts.tls_location);
  var sslCreds = grpc.credentials.createSsl(lndCert);
  var macaroon = getMacaroon(opts);
  var metadata = new grpc.Metadata();
  metadata.add("macaroon", macaroon);
  var macaroonCreds = grpc.credentials.createFromMetadataGenerator(
    (_args, callback) => {
      callback(null, metadata);
    }
  );
  return grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
}

function loadWalletUnlocker(opts) {
  var credentials = loadCredentials(opts);
  try {
    var lnrpcDescriptor = grpc.load("./walletunlocker.proto");
    var lnrpc = lnrpcDescriptor.lnrpc;
    console.log("CONNECT TO", opts.lnd_ip);
    walletUnlocker = new lnrpc.WalletUnlocker(opts.lnd_ip, credentials);
    return walletUnlocker;
  } catch (e) {
    console.log(e);
  }
}

function unlockWallet(pwd, opts) {
  return new Promise(async function (resolve, reject) {
    let wu = loadWalletUnlocker(opts);
    wu.unlockWallet(
      { wallet_password: ByteBuffer.fromUTF8(pwd) },
      (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      }
    );
  });
}

function initWallet(pwd, opts) {
  return new Promise(async function (resolve, reject) {
    let wu = loadWalletUnlocker(opts);
    wu.initWallet(
      { wallet_password: ByteBuffer.fromUTF8(pwd) },
      (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      }
    );
  });
}

module.exports = {
  unlockWallet,
  initWallet,
};
