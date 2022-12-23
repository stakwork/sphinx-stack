const fs = require('fs');
const os = require('os')

const envFilePath = '/boltwall/.env';

const readEnvVars = () => fs.readFileSync(envFilePath, "utf-8").split(os.EOL);
const lnd_cert = fs.readFileSync('./lnd/bob/.lnd/tls.cert', {encoding: 'hex'});
console.log(lnd_cert)

const lnd_macaroon = fs.readFileSync('./lnd/bob/.lnd/data/chain/bitcoin/regtest/admin.macaroon', {encoding: 'hex'})
console.log(lnd_macaroon)

const setEnvValue = (key, value) => {
    const envVars = readEnvVars();
    const targetLine = envVars.find((line) => line.split("=")[0] === key);
    if (targetLine !== undefined) {
      // update existing line
      const targetLineIndex = envVars.indexOf(targetLine);
      // replace the key/value with the new value
      envVars.splice(targetLineIndex, 1, `${key}="${value}"`);
    } else {
      // create new key value
      envVars.push(`${key}="${value}"`);
    }
    // write everything back to the file system
    fs.writeFileSync(envFilePath, envVars.join(os.EOL));
  };

  setEnvValue('LND_TLS_CERT', lnd_cert)
  setEnvValue('LND_MACAROON', lnd_macaroon)
