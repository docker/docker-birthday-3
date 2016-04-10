#!/usr/bin/env bash

echo "Wait ES ready!"
while true; do
    nc -q 1 elasticsearch 9200 2>/dev/null && break
done

echo "Starting Kibana"
kibana
