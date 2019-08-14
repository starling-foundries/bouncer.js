const express = require('express')
const bodyParser = require('body-parser')
const jayson = require('jayson')
const _ = require('lodash')
const database = require('db/database.js');
require('dotenv').config();


let db = new database();
const check = {
    spend: function(args, callback) {
        var err = null;

        //check the caller is allowed
        if(!validSender(args.JSON()))
            {
                err = new Error("The sender is not allowed");
                return callback(err,"sender invalid");
            }


        //check the Target
        if(!validTarget(args))
        {
            err = new Error("The target contract is incorrect");
            return callback(err,"failed");
        }
        //try to send the transaction to the blockchain

        callback(err, 'meow')
    }
}
const operator = {
    speak: function(args, callback) {
        callback(null, 'woof')
    }
}
const ticket = {
    retrieve: function(args, callback) {
        callback(null, 'failed')
    }
}
const status = {
    self: function(args, callback) {
        callback(null, 'this is you')
    }
}

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
//recieves and relays a check
app.post('/', jayson.server(check).middleware())
app.post('/check', jayson.server(check).middleware())
//responds with the operator target, fee
app.get('/operator', jayson.server(operator).middleware())
//responds with the status information given a queued transaction ticket
app.get('/ticket', jayson.server(ticket).middleware())
//status informs the client of their account nonce and last transaction
app.get('/status', jayson.server(status).middleware())
app.listen(5000)


// Utility methods

/**
 * Recieves the sender and checks the database for a matching account with a matching non-negative nonce. assumes the args are valid and sanitized
 * @param {JSON} args 
 */
const validSender = async (args) => {
    //TODO: validate pubkey with zil SDK
    let response = await db.accounts.getItem(args.pubkey);
	if (! response) {
		await db.accounts.setItem(args.pubkey, args.nonce);
	}
	response = await storage.getItem(args.pubkey);
	console.log('response is ' + response);
    const acct = await response.json() // parse JSON
    const nonce = acct[1] // find db nonce
    if(nonce >= 0 && nonce == args.nonce){
    return true;
    }
    return false;
}


/**
 * Recieves the sender and checks that the operator's target matches the check's
 * @param {JSON} args 
 */
const validTarget = (args) => {
    return args.target === process.env.TARGET_CONTRACT;
}
