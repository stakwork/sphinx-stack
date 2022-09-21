
### run

docker volume rm $(docker volume ls -q)

docker-compose -f ./cln/cln.yml --project-directory . up -d --force-recreate

./cln/setup1.sh
./cln/setup2.sh bcrt1qqv5jmzm2zuljrpqm47amcvawr896crfp6glhnr

docker-compose -f ./cln/cln.yml --project-directory . down

./cln/clear.sh

docker exec -it lightningd ls broker
docker exec -it lightningd echo $GREENLIGHT_VERSION
docker exec -it lightningd locate lightningd
docker exec -it lightningd usr/local/bin/lightningd 
docker exec -it lightningd usr/local/bin/sphinx-key-broker --version

### down

docker rm cln1.sphinx -f

docker-compose down

### logs

docker logs cln1.sphinx

### bins

find . -name 'lightning*'

/usr/local/libexec/c-lightning

lightning_hsmd

### inside 

docker exec -it bitcoincore bitcoin-cli -regtest -rpcuser=foo -rpcpassword=bar -getinfo

docker exec -it cln1.sphinx bash

/usr/local/libexec/c-lightning/vls-proxy/remote_hsmd_vls

lightning-cli --network=regtest getinfo

lightning-cli --network=regtest help

lightning-cli --network=regtest signmessage hello

### build rust hsmd proxy

Cross.toml:
```toml
[build]
passthrough=["RUSTFLAGS"]
```

in validating-lightning-signer

cargo install cross

RUSTFLAGS='-C link-arg=-s' cross build --target=x86_64-unknown-linux-musl --bin=remote_hsmd_vls

RUSTFLAGS='-C target-feature=+crt-static' cross build --release --target=x86_64-unknown-linux-musl --bin=remote_hsmd_vls

file target/x86_64-unknown-linux-musl/release/remote_hsmd_vls

### copy to place

in sphinx-stack

cp ../validating-lightning-signer/target/x86_64-unknown-linux-musl/debug/remote_hsmd_vls ./cln

### copy broker executable 

cid=$(docker create sphinx-key-broker)
docker cp $cid:/usr/src/sphinx-key-broker - > cln/broker/sphinx-key-broker
docker rm -v $cid