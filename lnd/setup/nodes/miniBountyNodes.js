const macpath = ".lnd/data/chain/bitcoin/regtest/admin.macaroon";

const nodes = {
  bob: {
    alias: "bob",
    hostname: "bob-lnd.sphinx:38882",
    password: "bob12345",
    type: "lnd",
    macaroon: "/bob/" + macpath,
    mnemonic: [
      "above",
      "street",
      "spoon",
      "mercy",
      "shoot",
      "mammal",
      "color",
      "comic",
      "distance",
      "myself",
      "buyer",
      "response",
      "senior",
      "timber",
      "attract",
      "neither",
      "half",
      "laundry",
      "ethics",
      "swarm",
      "will",
      "boss",
      "spoil",
      "genius",
    ],
  },
};
module.exports = {
  nodes,
};
