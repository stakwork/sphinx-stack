var envVars = require("/example_bot/botEnvVars.json");
console.log(process.env.IS_SPHINX_STACK);
console.log("ENV VARS: ", envVars);
if (envVars[0].SPHINX_TOKEN != null) {
  console.log("WE GET HERE????");
  process.exit();
} else {
  process.abort();
}
