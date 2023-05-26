

rm -rf ./bitcoind/regtest

rm -rf ./lnd/alice

rm -rf ./lnd/bob

rm -rf ./lnd/carol

rm -rf ./lnd/dave

rm -rf ./relay/db/alice.db

rm -rf ./relay/db/bob.db

rm -rf ./relay/db/carol.db

rm -rf ./relay/db/dave.db

rm -rf ./relay/NODES.json

rm -rf ./pgdata

#Redis data is for the sphinx-betting-bot
rm -rf ./redisData

#SPHINX_TOKEN for bots
rm -rf ./relay/botEnvVars.json

#Remove the certs for proxy
rm -rf ./proxy/badger
rm -rf ./proxy/cert
rm -rf ./proxy/macaroons

#transport keys
rm ./relay/*.pem

#Remove cln 
rm -rf ./cln/dave-cln/regtest

rm -rf ./cln/dave-cln/lightningd-regtest.pid
