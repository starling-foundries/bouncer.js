const { Transaction } = require('@zilliqa-js/account');
const { BN, Long, bytes, units, PRESETS } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const CP = require('@zilliqa-js/crypto');
require('dotenv').config()

class Relay {
    constructor() {
        this.zilliqa = new Zilliqa("https://dev-api.zilliqa.com/");
        const VERSION = 21823489;
        zilliqa.wallet.addByPrivateKey(process.env.BOUNCER_KEY);
        console.log("Your account is:");
        console.log(zilliqa.wallet);
        const TokenContract = zilliqa.contracts.at(process.env.TARGET_CONTRACT);
    }

    //get the gas - would be useful to poll this instead of repeatedly calling
    minGas() {
        const minGasPrice = this.zilliqa.blockchain.getMinimumGasPrice();
        console.log(`Current Minimum Gas Price: ${minGasPrice.result}`);
        return minGasPrice;
    }

    myGas() {
        const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions
        console.log(`My Gas Price ${myGasPrice.toString()}`)
        console.log('Sufficient Gas Price?');
        console.log(myGasPrice.gte(new BN(minGasPrice.result)));
        return myGasPrice;
    }


    /**
     * The relayer tries to call the remote contract's operatorSend.
     * @param {JSON} args from the client - unmodified
     * @returns a Promise<Transaction> 
     */
    sendCheck(args) {
        return this.TokenContract.call(
            "operatorSend",
            [
                {
                    vname: "from",
                    type: "ByStr20",
                    value: "Hello World"
                },
                {
                    vname: "to",
                    type: "ByStr20",
                    value: "Hello World"
                },
                {
                    vname: "amount",
                    type: "Uint128",
                    value: "Hello World"
                },
                {
                    vname: "userData",
                    type: "String",
                    value: "Hello World"
                },
                
                {
                    vname: "operatorData",
                    type: "String",
                    value: "Hello World"
                },
                
                
            ],
            {
                // amount, gasPrice and gasLimit must be explicitly provided
                version: VERSION,
                amount: new BN(0),
                gasPrice: myGas(),
                gasLimit: Long.fromNumber(8000),
            }
        );
    }

    /**
     * The relayer tries to call the remote contract on the blockchain with the client's parameters.
     * @param {JSON} args from the client - unmodified
     * @returns a Promise<Transaction> 
     */
    sendCheck(args) {
        return this.TokenContract.call(
            "sendBySignature",
            [
                {
                    vname: "from",
                    type: "ByStr20",
                    value: "Hello World"
                },
                {
                    vname: "to",
                    type: "ByStr20",
                    value: "Hello World"
                },
                {
                    vname: "amount",
                    type: "Uint128",
                    value: "Hello World"
                },
                {
                    vname: "fee",
                    type: "Uint128",
                    value: "Hello World"
                },
                {
                    vname: "operatorAddr",
                    type: "ByStr20",
                    value: "Hello World"
                },
                
                {
                    vname: "signature",
                    type: "ByStr33",
                    value: "Hello World"
                },
                
                
            ],
            {
                // amount, gasPrice and gasLimit must be explicitly provided
                version: VERSION,
                amount: new BN(0),
                gasPrice: myGasPrice,
                gasLimit: Long.fromNumber(8000),
            }
        );
    }

}