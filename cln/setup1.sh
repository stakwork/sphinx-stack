BTC="docker exec -it bitcoincore bitcoin-cli -regtest -rpcuser=foo -rpcpassword=bar"

# $BTC -getinfo

$BTC createwallet cln

ADDY=`$BTC getnewaddress`

echo "ADDY:"
echo $ADDY

# $BTC generatetoaddress 101 $(docker exec -it bitcoincore bitcoin-cli -regtest -rpcuser=foo -rpcpassword=bar getnewaddress)