#!/bin/sh
set -o xtrace

if [ "$1" = 'install_and_start' ]; then
    # only install node dependencies on first run
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    # replace the references to localhost with the docker container host names
    sed -i -e 's/127.0.0.1/postgres/g' src/datasources/pgsql.datasource.config.json
    sed -i -e 's/127.0.0.1/redis/g' src/datasources/redis.datasource.config.json
    # watch for changes in the typescript file and recompile
    npm run build:watch &
    # watch for changes in the compiled js files and restart the server
    npm run start:watch
    # we reach this point only if start:watch didn't block, maybe it crashed because of missing node modules
    npm install
    # try starting the server again
    npm run start:watch
    # crashed again
    exit 42
fi

exec "$@"
