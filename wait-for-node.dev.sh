#!/usr/bin/env bash

curl_opts='--output /dev/null --silent --head --fail'

until $(curl $curl_opts $OCN_NODE_URL/health); do
    printf 'waiting for node up\n'
    sleep 5
done

printf 'node is up\n'

data="[{\"party_id\":\"flx\",\"country_code\":\"de\"}]"
echo sending $data
res=$(curl --silent -XPOST $OCN_NODE_URL/admin/generate-registration-token -H "Authorization: Token $OCN_NODE_KEY" -H 'Content-Type: application/json' -d $data)

echo "generated token_a $res"

# ensure node is registered
./node_modules/.bin/ocn-registry set-node $OCN_NODE_URL -s 0x1c3e5453c0f9aa74a8eb0216310b2b013f017813a648fce364bf41dbc0b37647 &> /dev/null

# init in-memory db (local dev only)
cp inMemoryDB_EWFlex.default.json inMemoryDB_EWFlex.json

OCN_TOKEN_A="${res:10:36}" node .