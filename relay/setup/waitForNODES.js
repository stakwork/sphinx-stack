var fs = require("fs");

while (!fs.existsSync("/stack/NODES.json")) {}

process.exit();
