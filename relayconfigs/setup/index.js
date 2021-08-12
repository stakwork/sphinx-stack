var signup = require("./signup");
var fs = require("fs");
var paths = require("./paths");
var fetch = require("./fetch");

async function setup() {
  preSetup();
  var nodes = require(paths.path);
  await asyncForEach(nodes, async function (n, i) {
    await pollReady(n, i);
    await sleep(1000);
    console.log("=========> SETUP <==========");
    await signup.run_signup(n, i);
  });
  console.log("======================================");
  console.log("==                                  ==");
  console.log("==      =>  SETUP COMPLETE!  <=     ==");
  console.log("==                                  ==");
  console.log("======================================");
}
setup();

async function preSetup() {
  try {
    const exists = fs.existsSync(paths.pathToWrite);
    if (!exists) {
      console.log(
        "=>",
        paths.pathToWrite,
        "does not exist, creating now",
        exists
      );
      fs.copyFileSync(paths.path, paths.pathToWrite);
    } else {
      console.log("=>", paths.pathToWrite, "exists");
      // check ready to go! All fields there
      let clearAll = false;
      var nodes = require(paths.pathToWrite);
      nodes.forEach((n) => {
        if (!n.authToken) clearAll = true;
        if (!n.contact_key) clearAll = true;
        if (!n.privkey) clearAll = true;
        if (!n.exported_keys) clearAll = true;
      });
      if (clearAll) {
        // delete the database files
        fs.unlinkSync(paths.pathToWrite);
        fs.unlinkSync("/relayconfigs/db/alice.db");
        fs.unlinkSync("/relayconfigs/db/bob.db");
        fs.unlinkSync("/relayconfigs/db/carol.db");
        fs.unlinkSync("/relayconfigs/db/dave.db");
      }
    }
  } catch (e) {
    console.log("=> preSetup error", e);
  }
}

function pollReady(n, i) {
  return new Promise(async function (resolve, reject) {
    let ok = false;
    while (!ok) {
      try {
        await sleep(1000);
        const r = await fetch(n.ip + "/is_setup");
        // const txt = await r.json();
        if (r.ok) ok = true;
      } catch (e) {}
    }
    resolve();
  });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
