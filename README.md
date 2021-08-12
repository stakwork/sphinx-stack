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

`docker-compose pull`

`docker-compose up -d`

### stop

`docker-compose down`

Running `docker-compose down` instead of sending a SIGINT or SIGTERM is very important! Otherwise `bitcoind` will not finish writing to its database, and on the next run LND will crash with a block index mismatch.

You can also run with `Docker Desktop` and just use the "play" and "stop" buttons (and view the logs from each container).

### develop

- Run one of the sphinx clients on your local computer, and enter the `exported_keys` that you can find in `/relayconfigs/NODES.json`

### troubleshooting

There's lots of moving pieces! On a slower computer (or an M1 mac), do `export COMPOSE_HTTP_TIMEOUT=120` first
