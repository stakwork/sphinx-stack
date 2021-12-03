

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
