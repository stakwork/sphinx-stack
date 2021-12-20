while read i; do if [ "$i" = NODES.json ]; then break; fi; done \
   < <(inotifywait  -e create,open --format '%f' --quiet /tmp --monitor)
