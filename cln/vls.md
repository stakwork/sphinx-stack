
docker-compose -f ./cln/cln-vls.yml --project-directory . up -d --force-recreate

docker-compose -f ./cln/cln-vls.yml --project-directory . down

### get the version 

`git describe --tags --long --always --match='v*.*'`

and only take the last 8 chars of the last string

or 

`docker run -it --entrypoint "/bin/bash" sphinx-cln`

`lightningd --version`

### build

docker build . -t sphinx-cln

docker tag sphinx-cln sphinxlightning/sphinx-cln-vls:0.1.3

docker push sphinxlightning/sphinx-cln-vls:0.1.3

### testing

in sphinx-key:

cargo run --bin sphinx-key-tester -- --log