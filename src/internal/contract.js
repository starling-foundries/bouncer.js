/**
 * Utilities for deploying, managing and calling contracts. See relay.js for more blockchain-related functionality.
 */

const { Zilliqa } = require("@zilliqa-js/zilliqa");
const { BN, Long, bytes, units } = require("@zilliqa-js/util");
const CP = require("@zilliqa-js/crypto");
const { promisify } = require("util");
const fs = require("fs");

const CHAIN_ID = 333;
const MSG_VERSION = 1;
const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);

// const zilliqa = new Zilliqa("http://localhost:4200");
const zilliqa = new Zilliqa("https://dev-api.zilliqa.com");

const CONTRACT_PATH = "./scilla/ERC777.scilla";
const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;
const ORACLE_PRIVATE_KEY = process.env.ORACLE_PRIVATE_KEY;

zilliqa.wallet.addByPrivateKey(OWNER_PRIVATE_KEY);
zilliqa.wallet.addByPrivateKey(ORACLE_PRIVATE_KEY);

const ownerAddress = CP.getAddressFromPrivateKey(OWNER_PRIVATE_KEY);
const oracleAddress = CP.getAddressFromPrivateKey(ORACLE_PRIVATE_KEY);
const contractAddress = "91121ec8f6fdd83992cd5edee29a8dbbd27d21f4";
const deployedContract = zilliqa.contracts.at(`0x${contractAddress}`);

// const myGasPrice = new BN(units.fromQa(new BN("100"), units.Units.Li));
// const myGasPrice = units.toQa("1000", units.Units.Li);
const myGasPrice = new BN("1000000000");

/**
 * reads a scilla contract from the filesystem into a string for deployment.
 * @param {string} filepath is the location of the .scilla contract.
 */
async function readContractFile(filepath) {
    const readfile = promisify(fs.readFile);
    try {
      const content = await readfile(filepath);
      return content.toString();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * deploys a contract using the 
   */
async function deployTestContract() {
    console.log("deploying contract...");
    const code = await readContractFile(CONTRACT_PATH);
    const contract = zilliqa.contracts.new(code, initParams);
    try {
      const [deployTx, deployedContract] = await contract.deploy({
        version: VERSION,
        gasPrice: myGasPrice,
        gasLimit: Long.fromNumber(100000)
      });
      console.log(deployTx, deployedContract);
      console.log(deployTx.receipt);
      return deployedContract;
    } catch (e) {
      console.error(e);
    }
  }
  