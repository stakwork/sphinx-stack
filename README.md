# sphinx-stack

Full stack Sphinx cluster, including:

- bitcoind
- LND
- relay
- sphinx-tribes
- sphinx-memes
- sphinx-auth
- sphinx-mqtt

### run

`docker-compose up`

### develop

- Run one of the sphinx clients on your local computer, and enter the `exported_keys` that you can find in `/relayconfigs/NODES.json`

### troubleshooting

There's lots of moving pieces! On a slower computer, do `export COMPOSE_HTTP_TIMEOUT=120` first
