var fs = require("fs");
var paths = require("./paths");

while (!fs.existsSync("./relay/NODES.json")) {
  console.log("Still in here");
}

do {
  var nodes = require("./relay/NODES.json");
} while (nodes[0].authToken == null);

process.exit();
