#!/usr/bin/env bash

echo "Tobi is testing out script"

    echo -e "0\ncomfort thumb render rubber plunge know average congress obey shy forward lawn\n" | lightning-hsmtool generatehsm hsm_secret
    mkdir root
    mkdir root/.lightning
    mkdir root/.lightning/regtest
    touch root/.lightning/regtest/hsm_secret
    chmod 777 ./root/.lightning/regtest/hsm_secret
    cp hsm_secret ./root/.lightning/regtest/hsm_secret
    chmod 0400 ./root/.lightning/regtest/hsm_secret
   
   echo "Done with new setup"
    
    # echo "Core lighting Stopped"
    # lightningd --addr=0.0.0.0:19846 --bitcoin-rpcconnect=bitcoind.sphinx --bitcoin-rpcport=18443 --network=regtest --bitcoin-rpcuser=evan --bitcoin-rpcpassword=thepass --log-level=debug --alias=dave-cln --grpc-port=10012 --accept-htlc-tlv-types=133773310 --plugin=/usr/local/libexec/c-lightning/plugins/gateway-cln-extension
    # echo "Core ligthning restarted"
