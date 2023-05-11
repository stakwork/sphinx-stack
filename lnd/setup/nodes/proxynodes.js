const macpath = ".lnd/data/chain/bitcoin/regtest/admin.macaroon";

const nodes = {
  alice: {
    alias: "alice",
    hostname: "alice-lnd.sphinx:38881",
    password: "alice12345",
    macaroon: "/alice/" + macpath,
    channels: [
      {
        host: "bob-lnd.sphinx:9735",
        pubkey:
          "02a38857848aca6b32ebcc3c85d07ee41354988f4f1e0b4e6ccd255eee6ed75b8d",
      },
      {
        host: "carol-lnd.sphinx:9735",
        pubkey:
          "0364c05cbcbb9612036cc66297445a88bcfc21941fd816e17a56b54b0b52ff02b9",
      },
      {
        host: "dave-lnd.sphinx:9735",
        pubkey:
          "030841d1519f19c68e80efc5ef5af3460ca4bfa17486fda9baca878b9ef255358f",
      },
    ],
    mnemonic: [
      "above",
      "hair",
      "trigger",
      "live",
      "innocent",
      "monster",
      "surprise",
      "discover",
      "art",
      "broccoli",
      "cable",
      "balcony",
      "exclude",
      "maple",
      "luggage",
      "dragon",
      "erosion",
      "basic",
      "census",
      "earn",
      "ripple",
      "gossip",
      "record",
      "monster",
    ],
  },
  bob: {
    alias: "bob",
    hostname: "bob-lnd.sphinx:38882",
    password: "bob12345",
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
  carol: {
    alias: "carol",
    hostname: "carol-lnd.sphinx:38883",
    password: "carol12345",
    macaroon: "/carol/" + macpath,
    mnemonic: [
      "about",
      "coconut",
      "future",
      "area",
      "gym",
      "prison",
      "panic",
      "estate",
      "diary",
      "treat",
      "belt",
      "pair",
      "lens",
      "vacuum",
      "water",
      "poet",
      "armed",
      "elegant",
      "enforce",
      "home",
      "fine",
      "reason",
      "genre",
      "master",
    ],
  },
  dave: {
    alias: "dave",
    mnemonic: [
      "august",
      "onion",
      "powder",
      "burst",
      "credit",
      "vessel",
      "cloth",
      "swarm",
      "search",
      "error",
      "mosquito",
      "walnut",
    ],
  },
  // dave: {
  //   alias: "dave",
  //   hostname: "dave-lnd.sphinx:38884",
  //   password: "dave12345",
  //   macaroon: "/dave/" + macpath,
  //   mnemonic: [
  //     "able",
  //     "stuff",
  //     "magic",
  //     "beach",
  //     "ankle",
  //     "exotic",
  //     "blood",
  //     "capital",
  //     "motor",
  //     "crouch",
  //     "once",
  //     "pigeon",
  //     "awake",
  //     "same",
  //     "ill",
  //     "crane",
  //     "write",
  //     "resource",
  //     "interest",
  //     "rail",
  //     "cigar",
  //     "duty",
  //     "body",
  //     "outdoor",
  //   ],
  // },
};

/*
      able
      stuff
      magic
      beach
      ankle
      exotic
      blood
      capital
      motor
      crouch
      once
      pigeon
      awake
      same
      ill
      crane
      write
      resource
      interest
      rail
      cigar
      duty
      body
      outdoor

*/
module.exports = {
  nodes,
};
