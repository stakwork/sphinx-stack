
export BTC="docker exec -it bitcoincore bitcoin-cli -regtest -rpcuser=foo -rpcpassword=bar"

# cln1

export CLN1="docker exec -it cln1 usr/local/bin/lightning-cli --network regtest"

`$CLN1 getinfo`

02c7046d20f62012362ccf835fe5b4d4a1708e518592f216afeefabeadfc20154b

# cln2

export CLN2="docker exec -it cln2 usr/local/bin/lightning-cli --network regtest"

`$CLN2 getinfo`

export CLN2_PUBKEY=038655ec57fe06611cde27a386c52c5bdcb82c468386db02ef24e14a6e861f4c25

# connect

`$CLN1 newaddr`

export CLN1_ADDY=bcrt1qerw8fc2palc4vazppjn5ya7qdpj37apefnd9ew

`$BTC generatetoaddress 101 $CLN1_ADDY`

`$BTC generatetoaddress 101 $CLN1_ADDY`

`$CLN1 connect $CLN2_PUBKEY cln2:9736`

channel id: 
038655ec57fe06611cde27a386c52c5bdcb82c468386db02ef24e14a6e861f4c25

`$CLN1 fundchannel 038655ec57fe06611cde27a386c52c5bdcb82c468386db02ef24e14a6e861f4c25 100000`

`$BTC generatetoaddress 101 $CLN1_ADDY`

`$CLN1 keysend $CLN2_PUBKEY 1000`

# check

`$CLN2 waitanyinvoice 0 0`

# with TLVs

`$CLN1 keysend $CLN2_PUBKEY 1000 label 0.5 60 1 5000 {\"133773310\":\"444444444444444444444444444444444444444444444444444444444444444444\"}`

# check

`$CLN2 waitanyinvoice 1 0`
