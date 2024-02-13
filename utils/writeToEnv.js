const readEnvVars = (envFilePath) =>
  fs.readFileSync(envFilePath, "utf-8").split(os.EOL);

export default function setEnvValue(key, value, envFilePath) {
  const envVars = readEnvVars(envFilePath);
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
}
