const express = require('express')
const bodyParser = require('body-parser')
const jayson = require('jayson')
const _ = require('lodash')
const database = require('db/database.js');
require('dotenv').config();
const sha256 = require('js-sha256');


let db = new database();
const check = {
    spend: function (args, callback) {
        var err = null;

        //check the caller is allowed
        if (!validSender(args.JSON())) {
            err = new Error("The sender is not allowed");
            return callback(err, "sender invalid");
        }


        //check the Target
        if (!validTarget(args)) {
            err = new Error("The target contract is incorrect");
            return callback(err, "failed");
        }
        //try to send the transaction to the blockchain

        callback(err, 'meow')
    }
}
const operator = {
    fee: function (args, callback) {
        callback(null, process.env.MIN_FEE);
    },
    target: function (args, callback) {
        callback(null, process.env.TARGET_CONTRACT);
    },
    getStatus: function(args, callback){
        callback(null, "put status here");
    }
}
const ticket = {
    retrieve: function (args, callback) {
        try {
            let tx = getTransactionFromID(err, args)
        } catch (error) {
            console.log(error);
        }
        callback(err, tx);
    }
}


const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//recieves and relays a check
app.post('/', jayson.server(check).middleware())
app.post('/check', jayson.server(check).middleware())
//responds with the operator target, fee
app.get('/operator', jayson.server(operator).middleware())
//responds with the status information given a queued transaction ticket
app.get('/ticket', jayson.server(ticket).middleware())
app.listen(5000)


// Utility methods

/**
 * Recieves the sender and checks the database for a matching account with a matching non-negative nonce. assumes the args are valid and sanitized
 * @param {JSON} args 
 */
const validSender = async (args) => {
    //TODO: validate pubkey with zil SDK
    let response = await db.accounts.getItem(args.pubkey);
    if (!response) {
        await db.accounts.setItem(args.pubkey, args.nonce);
    }
    response = await db.accounts.getItem(args.pubkey);
    console.log('response is ' + response);
    const acct = await response.json() // parse JSON
    const nonce = acct[1] // find db nonce
    if (nonce >= 0 && nonce == args.nonce) {
        return true;
    }
    return false;
}


/**
 * Recieves the sender and checks that the operator's target matches the check's
 * @param {JSON} args 
 * @returns {boolean} if the target contract of the operator matches the check's params
 */
const validTarget = (args) => {
    return args.target === process.env.TARGET_CONTRACT;
}


/**
 * Look for the transaction corresponding to the server-assigned ID and reply with latest information
 * @param err container for any necessary errors
 * @param {JSON} args should be client pubkey, queueID
 * @returns {String} the blockchain-assigned transaction ID for use with viewblock
 */
const getTransactionFromID = (args) => {
    let response = await db.cache.getItem(args.queueID);
    if (!response) {
        throw "transaction does not exist";
    }
    return response.JSON().mainchainID;
}

/**
 * 
 * @param {JSON} args must contain the caller's public key
 */
const getStatus = (args) => {
    let lastTX = await db.cache.getItem();
    if (!response) {
       throw "this account has no status";
        return;
    }
    return response.JSON().mainchainID;
}

/**
 * Loads the transaction into the database and calls the relayer to attempt to send
 * @param {JSON} args should be the entire checkTransaction
 */
const acceptCheck = (args) =>{
    let queueID = hashID(args.pubkey, args.nonce);
    let response = await db.cache.getItem(queueID);
    if (response) {
        throw "check already in queue";
        return;
    }
    await db.cache.setItem(queueID, args);
    console.log("tried to add " + queueID);
    try{
        relayer.sendCheck(args);
    }catch(error){
        console.log(error);
    }
}

/**
 * concatenates the hashes of a pubkey, nonce to create an identifier key - can be used client-side to derive expected queueID
 * @param {string} pubkey
 * @param {number} nonce
 */
const hashID = (pubkey,nonce) =>{
    return sha256(sha256(pubkey) || sha256(nonce))
}