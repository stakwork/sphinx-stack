echo '[]' > ./relay/botEnvVars.json

docker-compose -f ./alts/proxy.yml -f ./alts/bots.yml --project-directory . up -d