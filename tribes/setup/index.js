const fs = require("fs");
const os = require("os");

const envFilePath = "./tribes/.env";

const readEnvVars = () => fs.readFileSync(envFilePath, "utf-8").split(os.EOL);

const setEnvValue = (key, value) => {
  const envVars = readEnvVars();
  const targetLine = envVars.find((line) => line.split("=")[0] === key);
  if (targetLine !== undefined) {
    // update existing line
    const targetLineIndex = envVars.indexOf(targetLine);
    // replace the key/value with the new value
    envVars.splice(targetLineIndex, 1, `${key}="${value}"`);
  } else {
    // create new key value
    envVars.push(`${key}="${value}"`);
  }
  // write everything back to the file system
  fs.writeFileSync(envFilePath, envVars.join(os.EOL));
};

let interval;

interval = setInterval(() => {
  try {
    const nodes = fs.readFileSync("./relay/NODES.json", "utf-8");

    console.log(nodes);
    if (nodes) {
      const parsedNodes = JSON.parse(nodes);
      if (Array.isArray(parsedNodes)) {
        for (let i = 0; i < parsedNodes.length; i++) {
          const node = parsedNodes[i];
          if (node.alias === "bob" && node.authToken && node.ip) {
            setEnvValue("RELAY_URL", node.ip);
            setEnvValue("RELAY_AUTH_KEY", node.authToken);

            if (interval) {
              console.log("we got here actually");
              clearInterval(interval);
            }
          }
        }
      }
    }
  } catch (error) {
    console.log("There is an error here");
  }
}, 10000);
