


docker-compose -f ./cln/cln-vls.yml --project-directory . up -d --force-recreate

docker-compose -f ./cln/cln-vls.yml --project-directory . down

### get the version 

`git describe --tags --long --always --match='v*.*'`

and only take the last 8 chars of the last string

or 

`docker run -it --entrypoint "/bin/bash" sphinx-cln`

`lightningd --version`