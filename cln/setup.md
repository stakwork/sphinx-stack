
export BTC="docker exec -it bitcoincore bitcoin-cli -regtest -rpcuser=foo -rpcpassword=bar"

# cln1

export CLN1="docker exec -it cln1 usr/local/bin/lightning-cli --network regtest"

`$CLN1 getinfo`

02010083aa8badd8a0720587220242920db7d33a0c5e3720bcc4e32b75043c8548

# cln2

export CLN2="docker exec -it cln2 usr/local/bin/lightning-cli --network regtest"

`$CLN2 getinfo`

export CLN2_PUBKEY=03ae7a6e718d6e683720eb4d9e7804b5ba27b7c5a16b201951b96aaa87607b72b2

# connect

`$CLN1 newaddr`

export CLN1_ADDY=bcrt1qsug4ku9cc4wfjvhrq9q8mn25hm6u2jsemws5hr

`$BTC generatetoaddress 101 $CLN1_ADDY`

`$BTC generatetoaddress 101 $CLN1_ADDY`

`$CLN1 connect $CLN2_PUBKEY cln2:9736`

channel id: 
03ae7a6e718d6e683720eb4d9e7804b5ba27b7c5a16b201951b96aaa87607b72b2

`$CLN1 fundchannel 03ae7a6e718d6e683720eb4d9e7804b5ba27b7c5a16b201951b96aaa87607b72b2 100000`

`$BTC generatetoaddress 101 $CLN1_ADDY`

`$CLN1 keysend $CLN2_PUBKEY 1000`

# check

`$CLN2 waitanyinvoice 0 0`

# with TLVs

`$CLN1 keysend $CLN2_PUBKEY 1000 label 0.5 60 1 5000 {\"133773310\":\"444444444444444444444444444444444444444444444444444444444444444444\"}`

# check

`$CLN2 waitanyinvoice 1 0`
