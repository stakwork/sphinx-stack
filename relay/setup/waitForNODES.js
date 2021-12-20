var fs = require("fs");

while (!fs.existSync("/stack/NODES.json")) {}

process.exit();
