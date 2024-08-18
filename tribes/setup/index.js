const fs = require("fs");

const scriptPath = "./tribes/script.sh";

let interval;

interval = setInterval(() => {
  try {
    const nodes = fs.readFileSync("./relay/NODES.json", "utf-8");

    if (nodes) {
      console.log("Nodes:", nodes);
      const parsedNodes = JSON.parse(nodes);
      if (!Array.isArray(parsedNodes)) return;
      const node = parsedNodes.find((n) => n.alias === "bob");
      if (!node) return;
      if (node.authToken && node.ip) {
        // Content of the Bash script
        finish(`
#!/bin/bash
echo "Hello from the Bash script!"
export RELAY_URL=${node.ip}
export RELAY_AUTH_KEY=${node.authToken}
`);
      }
      if (node.adminToken && node.ip && node.v2 === true) {
        finish(`
#!/bin/bash
echo "Hello from the Bash script v2!"
export V2_BOT_URL=${node.ip}
export V2_BOT_TOKEN=${node.authToken}
`);
      }
    }
  } catch (error) {
    console.log(
      "Error trying to read relay nodes file: ",
      JSON.stringify(error)
    );
  }
}, 10000);

function finish(bashScriptContent) {
  // Write to the file
  fs.writeFileSync(scriptPath, bashScriptContent);
  console.log(`Bash script written to: ${scriptPath}`);
  if (interval) {
    clearInterval(interval);
  }
}
