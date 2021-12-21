var fs = require("fs");

while (!fs.existsSync("./relay/NODES.json")) {
  console.log("Still in here");
}

process.exit();
