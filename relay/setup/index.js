var signup = require("./signup");
var fs = require("fs");
var paths = require("./paths");
var fetch = require("./fetch");
// var rsa = require("./rsa");

async function setup() {
  await preSetup();
  var nodes = require(paths.pathToWrite);
  console.log("nodes we're working with after presetup", nodes);
  if (process.env.ALICE_IP) {
    nodes[0].ip = process.env.ALICE_IP;
  }
  await asyncForEach(nodes, async function(n, i) {
    await pollReady(n, i);
    await sleep(1000);
    console.log("=========> SIGNUP SETUP <==========");
    await signup.run_signup(n, i);
    console.log("=========> SIGNUP SETUP DONE <==========");
  });

  /*Bot creation is being done here
  we want to generate new bot env vars
  if we do not have any generated yet
  this comes in handy when a person fresh
  installs the sphinx-stack*/
  botEnvVars = require(paths.botEnvVars);
  botConfig = require(paths.botConfig);

  console.log("===> setting up botEnvVars");
  if (botEnvVars.length != botConfig.length) {
    var finalNodes = require(paths.pathToWrite);

    let newBotEnvVars = [];

    console.log("===> before await each");
    await asyncForEach(botConfig, async function(botConfigValues, botIndex) {
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      await sleep(20000);
      console.log("===> before createBotKey");
      const nextKeyPortPair = await createBotKey(
        botConfigValues,
        botIndex,
        finalNodes[0]
      );

      console.log("===> before newBotEnvVars");
      newBotEnvVars[botIndex] = nextKeyPortPair;
    });

    fs.writeFileSync(paths.botEnvVars, JSON.stringify(newBotEnvVars, null, 2));
  }
  console.log("===> finished setting up botEnvVars");

  console.log("======================================");
  console.log("==                                  ==");
  console.log("==      =>  SETUP COMPLETE!  <=     ==");
  console.log("==                                  ==");
  console.log("======================================");
}
setup();

async function createBotKey(botConfigValues, botIndex, n) {
  const { name, webhook } = botConfigValues;

  try {
    const r = await fetch(n.ip + "/bot/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-token": n.authToken,
      },
      body: JSON.stringify({
        name: name,
        webhook: webhook,
      }),
    });

    //We're aborting if the relay service isn't availible yet
    const NODES = require(paths.pathToWrite);
    if (r.status == 401) {
      process.abort();
    }

    const botResponse = await r.json();
    const botResponseBody = botResponse.response;

    let url = "http://alice.sphinx:3001/action";
    if (process.env.ALICE_IP) {
      url = process.env.ALICE_IP + "/action";
    }
    return {
      SPHINX_TOKEN:
        Buffer.from(botResponseBody.id).toString("base64") +
        "." +
        Buffer.from(botResponseBody.secret).toString("base64") +
        "." +
        Buffer.from(url).toString("base64"),
      PORT: botConfig[botIndex].port,
    };
  } catch (e) {
    console.log(e);
  }
}

async function preSetup() {
  try {
    let exists = fs.existsSync(paths.pathToWrite);
    const botKeysExist = fs.existsSync(paths.botEnvVars);

    if (!botKeysExist) {
      console.log(
        "=>",
        paths.botEnvVars,
        "does not exist, creating now",
        botKeysExist
      );
      fs.writeFileSync(paths.botEnvVars, JSON.stringify([]));
    }
    if (!exists) {
      console.log(
        "=>",
        paths.pathToWrite,
        "does not exist, creating now",
        exists
      );
      fs.copyFileSync(paths.path, paths.pathToWrite);
      const existingNodes = require(paths.pathToWrite);
      for (const node of existingNodes) {
        if (node.admin_token) {
          await writeVirtualNodes(node);
        }
      }
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
        fs.unlinkSync("/relay/db/alice.db");
        fs.unlinkSync("/relay/db/bob.db");
        fs.unlinkSync("/relay/db/carol.db");
        fs.unlinkSync("/relay/db/dave.db");
      }
    }
  } catch (e) {
    console.log("=> preSetup error", e);
  }
}

async function writeVirtualNodes(node) {
  //const virtualNodes = await fetch("http://proxy.sphinx:5050/list", {"x-admin-token": "r46bnf8ibrhbb424heba"})

  return new Promise(async function(resolve, reject) {
    let ok = false;
				let count = 0
    while (!ok && count < 100) {
      try {
        await sleep(2000);
        const r = await fetch(node.proxy_ip + "/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": node.admin_token,
          },
        });
        const json = await r.json();
        if (json.length > 0) {
          console.log("THIS IS THE RESPONSE OF LIST FROM PROXY: ", json);
          var nodesPartial = require(paths.pathToWrite);
          nodesPartial.pop();
          json.forEach((privateChannel, index) => {
            console.log(privateChannel);
            const pushValue = {
              pubkey: privateChannel.pubkey,
              routeHint: node.pubkey + ":" + privateChannel.channel,
              alias: `virtualNode${index}`,
              ip: node.ip,
              external_ip: node.external_ip,
            };
            nodesPartial.push(pushValue);
          });
          const jsonString = JSON.stringify(nodesPartial, null, 2);
          console.log(nodesPartial);

          console.log("this is what we're writing", jsonString);
          //fs.copyFileSync(jsonString, paths.pathToWrite);
          fs.writeFileSync(paths.pathToWrite, []);
        }
        if (r.ok && json.length > 0) ok = true;
      } catch (e) {
        console.log(e);
      }
						count++
    }
    resolve();
  });
}

function pollReady(n, i) {
  return new Promise(async function(resolve, reject) {
    let ok = false;
    while (!ok) {
      try {
        await sleep(10000);
        console.log("=> try ", n.ip + "/is_setup");
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
