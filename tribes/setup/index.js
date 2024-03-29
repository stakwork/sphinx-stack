const fs = require("fs");

const scriptPath = "./tribes/script.sh";

let interval;

interval = setInterval(() => {
  try {
    const nodes = fs.readFileSync("./relay/NODES.json", "utf-8");

    if (nodes) {
      const parsedNodes = JSON.parse(nodes);
      if (Array.isArray(parsedNodes)) {
        for (let i = 0; i < parsedNodes.length; i++) {
          const node = parsedNodes[i];
          if (node.alias === "bob" && node.authToken && node.ip) {
            // Content of the Bash script
            const bashScriptContent = `
#!/bin/bash

echo "Hello from the Bash script!"
export RELAY_URL=${node.ip}
export RELAY_AUTH_KEY=${node.authToken}
`;

            // Write to the file
            fs.writeFileSync(scriptPath, bashScriptContent);

            console.log(`Bash script written to: ${scriptPath}`);

            if (interval) {
              clearInterval(interval);
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(
      "Error trying to read relay nodes file: ",
      JSON.stringify(error)
    );
  }
}, 10000);
