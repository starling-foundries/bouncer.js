# bouncer.js

## Use and Maintenance note:

This is the official, maintained version of the Zilliqa bouncer, designed to work with both the scilla-ported ERC-777 and ERC-865 token standards. 
At present it is only partially functional,and some of the provisioning tasks like deploying the contract may have to be done outside the official js-sdk. 

## Overview
A simple, generic node-based metatransactions bouncer intended to embed in a service mesh or offer as a standalone microservice perhaps behind a proxy or integrated as a JSON-RPC behind a muxer. This bouncer implements all the core functionality required to run a metatransactions enabled token on the zilliqa blockchain. Including RPC relays, whitelists and a disk-backed mempool.

## Installing

To install this, you need to have node LTS and the requirements listed in `zilliqa/zilliqa-javascript-sdk`. Then:
*  clone this repo
*  run `npm install`  
*  `cp .env_example .env` 
*  edit the .env to include your contract details
*  `npm run` will start the server

An example client can be used to test your relay and extended with full browser support. see `/src/client`.