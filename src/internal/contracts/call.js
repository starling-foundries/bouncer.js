const { Transaction } = require('@zilliqa-js/account');
const { BN, Long, bytes, units, PRESETS } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
// const { Contract } = require('@zilliqa-js/contract')
const CP = require ('@zilliqa-js/crypto');
// const hello = require('./hello');

const zilliqa = new Zilliqa("https://dev-api.zilliqa.com/");

// These are set by the core protocol, and may vary per-chain.
// You can choose to use the preset according to this example; 
// or you can manually pack the bytes according to chain id and msg version.
// For more information: https://apidocs.zilliqa.com/?shell#getnetworkid
const VERSION = 21823489;


zilliqa.wallet.addByPrivateKey("c4e0d95cc91d4cd72c68c9cf58eec49eb9e5c2cbc63fec61e7bef5e7555de0f0");
console.log("Your account is:");
console.log(zilliqa.wallet);

//get the gas
    const minGasPrice = zilliqa.blockchain.getMinimumGasPrice();
      console.log(`Current Minimum Gas Price: ${minGasPrice.result}`);
      const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions
      console.log(`My Gas Price ${myGasPrice.toString()}`)
      console.log('Sufficient Gas Price?');
      console.log(myGasPrice.gte(new BN(minGasPrice.result)));

const hello = zilliqa.contracts.at("zil13mf5zaahphzxk228u0kadk09z6plf8cuppv0df");
//Attempt to call hello world with dans's account:
const callTx = hello.call(
    "setHello",
    [
      {
        vname: "msg",
        type: "String",
        value: "Hello World"
      }
    ],
    {
      // amount, gasPrice and gasLimit must be explicitly provided
      version: VERSION,
      amount: new BN(0),
      gasPrice: myGasPrice,
      gasLimit: Long.fromNumber(8000),
    }
  );
  console.log(callTx);

  //Get the contract state
  const state = hello.getState();
  console.log("The state of the contract is:");
  console.log(state);