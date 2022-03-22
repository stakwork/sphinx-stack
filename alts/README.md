# alternate clusters

### no alice relay

Use this to develop on sphinx-relay

```
docker-compose -f ./alts/no-alice.yml --project-directory . up -d
```

Then in sphinx-relay
```
node ./dist/app.js --config="testing/stack/alice.json" --db="testing/stack/alice-db.json"
```

### no tribes server or frontend

Use this to develop on sphinx tribes server and frontend

```
docker-compose -f ./alts/no-tribes.yml --project-directory . up -d
```

### LSAT-based paywall

To use [aperture](https://docs.lightning.engineering/the-lightning-network/lsat/aperture)
as a way to protect certain endpoints in meme server using lightning enabled
LSATs, you can use the alt `alts/lsat.yml` config with the normal base compose.
By default the configuration assumes that alice's node will be used to generate
invoices protecting endpoints. This (and other items) can be configured via another
yaml file for the aperture configurations in `aperture/aperture.yaml`

Some configs to look at for more customization:

- `listenaddr` - for where the proxy is accessible from
- `authenticator` - lightning node configurations including host and where credentials can be found
- `services` - a list of services that will be protected by aperture.
  These have other options that can be used to customize the endpoint and protection conditions

To run sphinx stack with aperture:

```
docker-compose -f docker-compose.yml -f ./alts/lsat.yml --project-directory . up -d
```
