#!/usr/bin/env sh

until $(curl --output /dev/null --silent --head --fail http://localhost:8100/health); do
    printf 'waiting for node up\n'
    sleep 5
done

printf 'node is up\n'
node .