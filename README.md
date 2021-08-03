# start

docker-compose up

### tribes dev

To run tribes frontend locally, use these ports:

- tribes: `yarn start:tribes:docker` (localhost:23000)
- people: `yarn start:people:docker` (localhost:23007)

# to clear volumes (restart from scratch)

docker-compose down --volumes

### bitcoind

cd "/Users/evanfeenstra/Library/Application Support/Bitcoin"

docker run -it --rm \
 -v ~/code/sphinx-stack/.bitcoin:/data/.bitcoin \
 -p 8332:8332 \
 -p 8333:8333 \
 -p 28332:28332 \
 -p 28333:28333 \
 --name bitcoind \
 lncm/bitcoind:v0.21.1

### lnd

docker exec -it alice-lnd lncli --lnddir=/lnd/.lnd create
docker exec -it alice-lnd lncli --lnddir=/lnd/.lnd unlock

# CONTAINER NAMES = HOSTS

curl -i -X POST --cacert ~/code/sphinx-stack/lnd-data/alice/.lnd/tls.cert https://localhost:8181/v1/unlockwallet -d '{"wallet_password": "YXNkZmFzZGY="}'
