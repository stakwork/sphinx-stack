var fs = require("fs");

let index = process.env.SPHINX_INDEX;
var envVars = require("/example_bot/botEnvVars.json");
if (envVars[index].SPHINX_TOKEN != null) {
  //process.env.SPHINX_TOKEN = envVars[0].SPHINX_TOKEN;
  //process.env.PORT = envVars[0].PORT;

  console.log("isEnvAvailible: ", index, envVars[index].SPHINX_TOKEN);
  fs.writeFileSync(
    ".env",
    `SPHINX_TOKEN=${envVars[index].SPHINX_TOKEN} 
     PORT=${envVars[index].PORT}`
  );

  process.exit();
} else {
  process.abort();
}
