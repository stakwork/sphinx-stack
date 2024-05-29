const macpath = ".lnd/data/chain/bitcoin/regtest/admin.macaroon";

const nodes = {
  bob: {
    alias: "bob",
    hostname: "bob-lnd.sphinx:38882",
    password: "bob12345",
    type: "lnd",
    macaroon: "/bob/" + macpath,
    channels: [
      {
        host: "dave-cln.sphinx:19846",
        pubkey:
          "037ec785c6004d512ebaeb0020f81a2bcdb6fccc9539f7b891f704289ebc65a4e3",
      },
    ],
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
  dave: {
    alias: "dave",
    type: "cln",
    hostname: "dave-lnd.sphinx:38884",
  },
};

module.exports = {
  nodes,
};
