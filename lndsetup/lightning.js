var fetch = require("./fetch");
const https = require("https");
var fs = require("fs");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

async function listChannels(node) {
  return await doRequest(node, "listchannels", {
    body: JSON.stringify({
      hi: "hello",
    }),
  });
}

module.exports = {
  listChannels,
};

async function doRequest(node, theurl, params) {
  const ps = params || {};
  try {
    const macLocation = node.macaroon_location;
    if (!macLocation) {
      throw new Error("no macaroon");
    }
    var macaroonString = fs.readFileSync(macLocation);
    var mac = Buffer.from(macaroonString, "utf8").toString("hex");
    const theParams = {
      method: ps.method || "POST",
      agent: httpsAgent,
      headers: {
        "Grpc-Metadata-macaroon": mac,
        "Content-Type": "application/json",
      },
      ...ps,
    };
    const r = await fetch(theurl, theParams);
    const j = await r.json();
    return j;
  } catch (e) {
    throw e;
  }
}
