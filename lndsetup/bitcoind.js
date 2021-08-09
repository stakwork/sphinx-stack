const fetch = require("./fetch");

async function mine(n, addy) {
  try {
    let num = n || 1;
    const r = await fetch("http://evan:thepass@bitcoind.sphinx:18443", {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "1.0",
        id: "1",
        method: "generatetoaddress",
        params: [num, addy],
      }),
    });
    const j = await r.text();
    return j;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  mine,
};
