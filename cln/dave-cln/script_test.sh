#!/usr/bin/env bash

echo "Tobi is testing out script"

if [ -e "/hsm_secret" ]; then
    echo "File exists"
else
    echo "File does not exist"
    echo -e "0\ncomfort thumb render rubber plunge know average congress obey shy forward lawn\n" | lightning-hsmtool generatehsm hsm_secret
    sleep 40
    chmod 777 ./root/.lightning/regtest/hsm_secret
    cp hsm_secret ./root/.lightning/regtest/hsm_secret
    chmod 0400 ./root/.lightning/regtest/hsm_secret
    rm ./root/.lightning/regtest/lightningd.sqlite3
    lightning-cli --network=regtest stop
    echo "Core lighting Stopped"
    lightningd --bitcoin-rpcconnect=bitcoind.sphinx --bitcoin-rpcport=18443 --network=regtest --bitcoin-rpcuser=evan --bitcoin-rpcpassword=thepass --log-level=debug --alias=dave-cln --grpc-port=10012 --accept-htlc-tlv-types=133773310 --plugin=/usr/local/libexec/c-lightning/plugins/gateway-cln-extension
    echo "Core ligthning restarted"
fi
