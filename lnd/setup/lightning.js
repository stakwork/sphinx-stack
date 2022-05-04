var fetch = require("./fetch");
const https = require("https");
var fs = require("fs");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// const address_type_p2wkh = "0";
// const address_type_np2wkh = "1";

async function getInfo(node) {
  return await doRequest(node, "v1/getinfo");
}

async function getBalance(node) {
  return await doRequest(node, "v1/balance/blockchain");
}

async function newAddress(node) {
  return await doRequest(node, "v1/newaddress?type=1");
}

async function listChannels(node) {
  return await doRequest(node, "v1/channels");
}

async function listPeers(node) {
  return await doRequest(node, "v1/peers");
}

// addr = pubkey@host format
async function addPeer(node, addr) {
  return await doRequest(node, "v1/peers", {
    addr,
  });
}

async function openChannel(node, chan) {
  return await doRequest(node, "v1/channels", {
    node_pubkey: Buffer.from(chan.pubkey, "hex").toString("base64"),
    local_funding_amount: chan.amount,
    push_sat: chan.push_amount,
  });
}

module.exports = {
  listChannels,
  newAddress,
  getInfo,
  getBalance,
  openChannel,
  listPeers,
  addPeer,
};

async function doRequest(node, theurl, body) {
  try {
    const macLocation = node.macaroon;
    if (!macLocation) {
      throw new Error("no macaroon");
    }
    // console.log(macLocation);
    var macaroonString = fs.readFileSync(macLocation);
    var mac = Buffer.from(macaroonString, "utf8").toString("hex").toUpperCase();
    const theParams = {
      method: body ? "POST" : "GET",
      agent: httpsAgent,
      headers: {
        "Grpc-Metadata-macaroon": mac,
        "Content-Type": "application/json",
      },
    };
    if (body) {
      theParams.body = JSON.stringify(body || {});
    }
    const url = `https://${node.hostname}/${theurl}`;
    const r = await fetch(url, theParams);
    if (!r.ok) {
      console.log("=> Request Failed:", r.status, r.statusText);
    }
    const j = await r.json();
    return j;
  } catch (e) {
    throw e;
  }
}

/*
curl --insecure --header "Grpc-Metadata-macaroon: 0201036C6E6402F801030A1067F4815F726C260716FCCB223852C3D11201301A160A0761646472657373120472656164120577726974651A130A04696E666F120472656164120577726974651A170A08696E766F69636573120472656164120577726974651A210A086D616361726F6F6E120867656E6572617465120472656164120577726974651A160A076D657373616765120472656164120577726974651A170A086F6666636861696E120472656164120577726974651A160A076F6E636861696E120472656164120577726974651A140A057065657273120472656164120577726974651A180A067369676E6572120867656E65726174651204726561640000062084FA3B5506DFF35DDF896EFF1DE39B307C43529F8A29F4A528EF3841C8DCA27E" https://localhost:38881/v1/getinfo
*/
