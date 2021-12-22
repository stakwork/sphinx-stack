var fs = require("fs");
var paths = require("./paths");

while (!fs.existsSync("./relay/NODES.json")) {
  console.log("Still in here");
}

do {
  var nodes = require("../NODES.json");
  console.log(nodes);
} while (!nodes[0].authToken);

process.exit();
