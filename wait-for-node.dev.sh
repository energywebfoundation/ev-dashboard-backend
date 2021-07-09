#!/usr/bin/env bash

curl_opts='--output /dev/null --silent --head --fail'

until $(curl $curl_opts $OCN_BRIDGE_NODE_URL/health); do
    printf 'waiting for node up\n'
    sleep 5
done

printf 'node is up\n'

data="[{\"party_id\":\"$OCN_BRIDGE_PARTY_ID\",\"country_code\":\"$OCN_BRIDGE_COUNTRY_CODE\"}]"
echo sending $data
res=$(curl --silent -XPOST $OCN_BRIDGE_NODE_URL/admin/generate-registration-token -H "Authorization: Token $OCN_BRIDGE_NODE_KEY" -H 'Content-Type: application/json' -d $data)

echo "generated token_a $res"
echo "token_a ${res:10:36}"

# ensure node is registered
./node_modules/.bin/ocn-registry set-node $OCN_NODE_URL -s 0x1c3e5453c0f9aa74a8eb0216310b2b013f017813a648fce364bf41dbc0b37647 --network-file ./networks.json &> /dev/null

OCN_BRIDGE_TOKEN_A="${res:10:36}" npm run start:dev
