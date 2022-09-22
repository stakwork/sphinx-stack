
export BTC="docker exec -it bitcoincore bitcoin-cli -regtest -rpcuser=foo -rpcpassword=bar"


# cln1

export CLN1="docker exec -it cln1 usr/local/bin/lightning-cli --network regtest"

`$CLN1 getinfo`

02e04e587983913d847d28627d4317d84688ae21c49a2b330e8b02256b58e2bc2a

# cln2

export CLN2="docker exec -it cln2 usr/local/bin/lightning-cli --network regtest"

`$CLN2 getinfo`

03238baf36a8cd5da6bede79f925a26b728263b6d103b1dfc4c02c4bb871c77010

# connect

`$CLN1 newaddr`

bcrt1qahdawsad4aqpdgcxefvvr5rcuztskq95h8hhrd

`$BTC generatetoaddress 101 bcrt1qahdawsad4aqpdgcxefvvr5rcuztskq95h8hhrd`

`$BTC generatetoaddress 101 bcrt1qahdawsad4aqpdgcxefvvr5rcuztskq95h8hhrd`

`$CLN1 connect 03238baf36a8cd5da6bede79f925a26b728263b6d103b1dfc4c02c4bb871c77010 cln2:9736`

channel id: 
03238baf36a8cd5da6bede79f925a26b728263b6d103b1dfc4c02c4bb871c77010

`$CLN1 fundchannel 03238baf36a8cd5da6bede79f925a26b728263b6d103b1dfc4c02c4bb871c77010 100000`

`$BTC generatetoaddress 101 bcrt1qahdawsad4aqpdgcxefvvr5rcuztskq95h8hhrd`

`$CLN1 keysend 03238baf36a8cd5da6bede79f925a26b728263b6d103b1dfc4c02c4bb871c77010 1000`

# check

`$CLN2 waitanyinvoice 0 0`

# with TLVs

`$CLN1 keysend 03238baf36a8cd5da6bede79f925a26b728263b6d103b1dfc4c02c4bb871c77010 1000 label 0.5 60 1 5000 {\"133773310\":\"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"}`

# check

`$CLN2 waitanyinvoice 3 0`
