var JSCryptor = require("../relay/setup/rncryptor");

// your private "contact key" (for end-to-end RSA encryption)
const private_key = "xxx";
// you public "contact key"
const public_key = "xxx";
// ip / domain of your node
const ip = "xxx";
// your sphinx relay auth token
const auth_token = "xxx";
// app PIN code
const pin = "111111";

const str = `${private_key}::${public_key}::${ip}::${auth_token}`;
const enc = JSCryptor.JSCryptor.Encrypt(str, pin);
const final = Buffer.from(`keys::${enc}`).toString("base64");
console.log(final);
