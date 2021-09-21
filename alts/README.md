# alternate clusters

### no alice relay

Use this to develop on sphinx-relay

docker-compose -f ./alts/no-alice.yml --project-directory . up -d

### no tribes server or frontend

Use this to develop on sphinx tribes server and frontend

docker-compose -f ./alts/no-tribes.yml --project-directory . up -d

### proxy testing

sphinx-proxy:
docker build --no-cache -t sphinx-proxy .
