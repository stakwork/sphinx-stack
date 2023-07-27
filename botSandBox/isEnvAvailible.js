var fs = require("fs");

let index = process.env.SPHINX_INDEX;
var envVars = require("./botEnvVars.json");

if (!fs.existsSync("./botEnvVars.json")) {
  let envVars = require("./botEnvVars");
  if (envVars.length == 0) {
    process.abort();
  }
}

//So this script is run when the bots are initialized so we can
//insert the SPHINX_TOKEN and PORT for the bots before they spin up
//the docker container restarts on failure and the command to run
//the bot depends on this file getting to process.exit()
if (envVars[index].SPHINX_TOKEN != null) {
  fs.writeFileSync(
    ".env",
    `SPHINX_TOKEN=${envVars[index].SPHINX_TOKEN} 
     PORT=${envVars[index].PORT}`
  );

  process.exit();
} else {
  process.abort();
}
