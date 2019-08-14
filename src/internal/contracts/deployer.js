const { Transaction } = require('@zilliqa-js/account');
const { BN, Long, bytes, units, PRESETS } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const CP = require ('@zilliqa-js/crypto');
const hello = require('./hello');

const zilliqa = new Zilliqa("https://dev-api.zilliqa.com/");

// These are set by the core protocol, and may vary per-chain.
// You can choose to use the preset according to this example; 
// or you can manually pack the bytes according to chain id and msg version.
// For more information: https://apidocs.zilliqa.com/?shell#getnetworkid
const VERSION = 21823489;


zilliqa.wallet.addByPrivateKey("c4e0d95cc91d4cd72c68c9cf58eec49eb9e5c2cbc63fec61e7bef5e7555de0f0");
console.log("Your account is:");
console.log(zilliqa.wallet);

//Attempt to deploy hello world with Alice's account:

 // Instance of class Contract
 const contract = zilliqa.contracts.new(hello.code, hello.init);

 async function testBlockchain() {
    try {
  
      // Get Balance
      const balance = await zilliqa.blockchain.getBalance(zilliqa.wallet.defaultAccount.address);
      // Get Minimum Gas Price from blockchain
      const minGasPrice = await zilliqa.blockchain.getMinimumGasPrice();
      console.log(`Your account balance is:`);
      console.log(balance.result)
      console.log(`Current Minimum Gas Price: ${minGasPrice.result}`);
      const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions
      console.log(`My Gas Price ${myGasPrice.toString()}`)
      console.log('Sufficient Gas Price?');
      console.log(myGasPrice.gte(new BN(minGasPrice.result))); // Checks if your gas price is less than the minimum gas price
  
      // Send a transaction to the network
      const tx = await zilliqa.blockchain.createTransaction(
        zilliqa.transactions.new({
          version: VERSION,
          toAddr: "zil172dgrwprv6ampamtn7md376tpz5xkh0q34fpvk",
          amount: new BN(units.toQa("1", units.Units.Zil)), // Sending an amount in Zil (1) and converting the amount to Qa
          gasPrice: myGasPrice, // Minimum gasPrice veries. Check the `GetMinimumGasPrice` on the blockchain
          gasLimit: Long.fromNumber(1)
        })
      );
      
  
      console.log(`The transaction status is:`);
      console.log(tx.receipt);
  
      // Deploy a contract
      const code = `scilla_version 0
  
      (* HelloWorld contract *)
  
      import ListUtils
  
      (***************************************************)
      (*               Associated library                *)
      (***************************************************)
      library HelloWorld
  
      let not_owner_code = Int32 1
      let set_hello_code = Int32 2
  
      (***************************************************)
      (*             The contract definition             *)
      (***************************************************)
  
      contract HelloWorld
      (owner: ByStr20)
  
      field welcome_msg : String = ""
  
      transition setHello (msg : String)
        is_owner = builtin eq owner _sender;
        match is_owner with
        | False =>
          e = {_eventname : "setHello()"; code : not_owner_code};
          event e
        | True =>
          welcome_msg := msg;
          e = {_eventname : "setHello()"; code : set_hello_code};
          event e
        end
      end
  
  
      transition getHello ()
          r <- welcome_msg;
          e = {_eventname: "getHello()"; msg: r};
          event e
      end`;
  
      const init = [
        // this parameter is mandatory for all init arrays
        {
          vname: "_scilla_version",
          type: "Uint32",
          value: "0"
        },
        {
          vname: "owner",
          type: "ByStr20",
          // NOTE: all byte strings passed to Scilla contracts _must_ be
          // prefixed with 0x. Failure to do so will result in the network
          // rejecting the transaction while consuming gas!
          value: `0x${zilliqa.wallet.defaultAccount.address}`
        }
      ];
  
      // Instance of class Contract
      const contract = zilliqa.contracts.new(code, init);
  
      // Deploy the contract
      const [deployTx, hello] = await contract.deploy({
        version: VERSION,
        gasPrice: myGasPrice,
        gasLimit: Long.fromNumber(10000000)
      });
  
      // Introspect the state of the underlying transaction
      console.log(`Deployment Transaction ID: ${deployTx.id}`);
      console.log(`Deployment Transaction Receipt:`);
      console.log(deployTx.txParams.receipt);
  
      // Get the deployed contract address
      console.log("The contract address is:");
      console.log(hello.address);
      const callTx = await hello.call(
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
      const state = await hello.getState();
      console.log("The state of the contract is:");
      console.log(state);
    } catch (err) {
      console.log(err);
    }
  }
  
  testBlockchain();
  