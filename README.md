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

Open a terminal inside the root directory of this repository. Then:

`docker-compose pull`

`docker-compose up -d`

### stop

`docker-compose down`

Running `docker-compose down` instead of sending a SIGINT or SIGTERM is very important! Otherwise `bitcoind` will not finish writing to its database, and on the next run LND will crash with a block index mismatch.

You can also run with `Docker Desktop` and just use the "play" and "stop" buttons (and view the logs from each container).

### clear

Clear the existing configs, so you can start fresh:

`./clearall.sh`

### aperture enabled paywall

The sphinx-stack docker compose file uses profiles to opt-in to particular services.
To run with an aperture-enabled paywall, start the stack with the 
following command:

```shell
docker compose -f docker-compose.yml --profile aperture --project-directory . up  -d
```

This will use the configs set in `/aperture/aperture.yaml`.
To update the timeout and other paywall related configs, edit that file. 

### developing/contributing to Sphinx

- Run one of the sphinx clients on your local computer, and enter the `exported_keys` that you can find in `/relay/NODES.json` (make sure to copy the trailing `=` equal signs if there are any!)
- the easiest client to get up and running is [Sphinx Desktop](https://github.com/stakwork/sphinx-win-linux-desktop)
- To find out how to modify sphinx components and contribute to the stack vist [Developing/Contributing on Sphinx](https://github.com/stakwork/sphinx-stack/blob/master/docs/developingOnSphinx.md)

- To find out how to develop bots on the sphinx stack visit [Developing bots on sphinx](https://github.com/stakwork/sphinx-stack/blob/master/docs/bots.md)

### troubleshooting

There's lots of moving pieces! On a slower computer (or an M1 mac), do `export COMPOSE_HTTP_TIMEOUT=120` first
