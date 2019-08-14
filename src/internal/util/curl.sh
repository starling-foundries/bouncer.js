# HDR='Content-type: application/json'
# MSG='{"jsonrpc": "2.0", "method": "speak", "id": 1}'
curl -H 'Content-type: application/json' -d '{"jsonrpc": "2.0", "method": "speak", "id": 1}' http://localhost:5000/cats
# {"jsonrpc":"2.0","result":"meow","id":1}
# curl -H $HDR -d $MSG http://localhost:5000/dogs
# {"jsonrpc":"2.0","result":"woof","id":1}