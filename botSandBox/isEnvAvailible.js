var envVars = require("/example_bot/botEnvVars.json");
var fs = require("fs");

if (envVars[0].SPHINX_TOKEN != null) {
  process.env.SPHINX_TOKEN = envVars[0].SPHINX_TOKEN;
  process.env.PORT = envVars[0].PORT;

  fs.writeFileSync(
    ".env",
    `SPHINX_TOKEN=${process.env.SPHINX_TOKEN} 
     PORT=${process.env.PORT}`
  );

  process.exit();
} else {
  process.abort();
}
