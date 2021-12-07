var signup = require("./signup");
var fs = require("fs");
var paths = require("./paths");
var fetch = require("./fetch");
var rsa = require("./rsa");

async function setup() {
  preSetup();
  var nodes = require(paths.path);
  if (process.env.ALICE_IP) {
    nodes[0].ip = process.env.ALICE_IP;
  }
  await asyncForEach(nodes, async function(n, i) {
    await pollReady(n, i);
    await sleep(1000);
    console.log("=========> SETUP <==========");
    await signup.run_signup(n, i);
  });

  /*Bot creation is being done here
  we want to generate new bot env vars
  if we do not have any generated yet
  this comes in handy when a person fresh
  installs the sphinx-stack*/
  botEnvVars = require(paths.botEnvVars);
  botConfig = require(paths.botConfig);

  if (botEnvVars.length != botConfig.length) {
    var finalNodes = require(paths.pathToWrite);

    let newBotEnvVars = [];

    await asyncForEach(botConfig, async function(botConfigValues, botIndex) {
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      const nextKeyPortPair = await createBotKey(
        botConfigValues,
        botIndex,
        finalNodes[0]
      );

      await sleep(20000);

      newBotEnvVars[botIndex] = nextKeyPortPair;
    });

    fs.writeFileSync(paths.botEnvVars, JSON.stringify(newBotEnvVars, null, 2));
  }

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
    if (r.status == 401) {
      process.abort();
    }

    const botResponse = await r.json();
    const botResponseBody = botResponse.response;

    return {
      SPHINX_TOKEN:
        Buffer.from(botResponseBody.id).toString("base64") +
        "." +
        Buffer.from(botResponseBody.secret).toString("base64") +
        "." +
        Buffer.from("http://alice.sphinx:3001/action").toString("base64"),
      PORT: botConfig[botIndex].port,
    };
  } catch (e) {
    console.log(e);
  }
}

async function preSetup() {
  try {
    const exists = fs.existsSync(paths.pathToWrite);
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

function pollReady(n, i) {
  return new Promise(async function(resolve, reject) {
    let ok = false;
    while (!ok) {
      try {
        await sleep(1000);
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
