var JSCryptor = require("../relay/setup/rncryptor");

// your exported key string
const exported_keys =
  "a2V5czo6QXdHalFrVXlPRHAyenNsNVk5bVpYTGt3MXRTeGZCcVMzTWRmdGtWM3krZ2k5S1pnZnNQVjNSeGZObWhjWG0rdGZ1TjM3ak5nd00yWTFYL1VzT0NhbGhqbVNKSi9nZVBHeE9JNGdJSDhhYTBLSE53Tnc5UjRNT3BFMXZ3Uk9hNkhUQ2M9";
// app PIN code
const pin = "111111";

const buf = Buffer.from(exported_keys, "base64");
const keyz = buf.toString().substr(6);
const dec = JSCryptor.JSCryptor.Decrypt(pin, keyz);

const arr = dec.split("::");

console.log("=> private_key:", arr[0]);
console.log("=> public_key:", arr[1]);
console.log("=> ip:", arr[2]);
console.log("=> auth_token:", arr[3]);
