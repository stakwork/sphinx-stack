const macpath = ".lnd/data/chain/bitcoin/regtest/admin.macaroon";

const nodes = {
  alice: {
    alias: "alice",
    hostname: "alice-lnd.sphinx:38881",
    password: "alice12345",
    macaroon: "/alice/" + macpath,
    type: "lnd",
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
        host: "dave-cln.sphinx:19846",
        pubkey:
          "037ec785c6004d512ebaeb0020f81a2bcdb6fccc9539f7b891f704289ebc65a4e3",
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
  carol: {
    alias: "carol",
    hostname: "carol-lnd.sphinx:38883",
    password: "carol12345",
    type: "lnd",
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
    type: "cln",
    hostname: "dave-lnd.sphinx:38884",
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
