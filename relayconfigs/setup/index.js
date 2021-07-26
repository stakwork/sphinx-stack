var signup = require("./signup");

async function setup() {
  await sleep(5000);
  console.log("=========> SETUP <==========");
  await signup.run_signup();
  console.log("=========> SETUP COMPLETE! <==========");
}
setup();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
