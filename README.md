# Molecule Project
## Scope
Unfortunately, the full scope of the project was not completed in the set amount of time. Below is a listing of what exactly works and what doesn't.

### Working 
- ERC721 contract 
	- add and remove from brightlist 
	- brightlisting can only be performed by the owner
- React application with Web3 provider injected 
- Minting Form enforces schema for payload
- Payload is encrypted, stores key in local storage and displays to end user
- Encrypted payload is uploaded to IPFS 

### Did not finish
- Getting a token to be minted with the `metadata.json`
- Error handling and messaging for attempting to mint when not brightlisted (the contract reverts but the app does not show this)
- Enforcement of only 1 NFT minted at a time
	- This is a trivial addition on the contract's part (just deleting the address from the brightlist once you complete the mint)
- The `tokenURI` request does not fit the schema exactly, I could not figure out how to get the token ID in the metadata that is stored in the token before the token was minted 
- The system is not deployed to a public URL or on Goerli

### Additional Tasks 
- Complete the missing functionality 
- Clean up the types usage to improve code quality
- Deploy the system to goerli and on a public hosting provider like heroku or aws 

## Structure
There are two separate top level projects here:

* blockchain: a hardhat environment for developing contracts which exports artifact ABI and deployment information directly into the `web` source directory
* web: the web client for interacting the on chain

## Getting Stated 
The basic flow to run the app at a high level is the following:
- Go to the blockchain module
- Add your local testing HD Wallet
- Install deps for `blockchain`
- Run the hardhat node in one terminal
- Deploy your contracts to the hardhat node locally 
	- This will cause the artifacts to be written over to the web client directory
- Now you need to setup IPFS locally (aka `--offline` mode)
	- Start the local daemon in another terminal window
- Once you have the node running you can move over to the webclient
- Install deps
- Run the web application
- Connect your wallet and you should be good

### IPFS 
#### Install 
You can install IPFS via `go` 

There is a script called `ipfsd.sh` in the root directory that runs an IPFS daemon in `--offline` mode. You can also run the recipe:

```
make ipfs.start
```

You can then use the `ipfs` CLI to `cat`, `add`, et cetera as needed. 

### Blockchain
#### Create an HD wallet for testing and add to the blockchain project
Before you can use the blockchain application you need to setup some Ethereum accounts. The `blockchain` project is setup to read from a local file `hardhatAccounts.dev.json` containing preset private keys and balances.

```javascript
{
  "hdWallet": {
    "path": "m/44'/60'/0'/0",
    "mnemonic": "<your-mnemonic-goes-here>",
    "initialIndex": 0,
    "count": 5,
    "passphrase": "<your-password-here>",
    "accountsBalance": "1100000000000000000000"
  }
}
```

There is a `hardhatAccounts.sample.json` file available for which you can reference as well to create your own.

To get a new mnemonic you can set up via Metamask or Coinbase Wallet.

> **NOTE** Make sure you setup MetaMask to use the Hardhat network (custom RPC via 31337) before hand.

MetaMask > Create Account > Copy private + Address

#### Getting Setup
Install dependencies 
```
cd blockchain 
yarn 
```
Once dependencies are installed you can run a few different recipes from the `Makefile` at the directory root (i.e. `cd ../`)

#### Running a Node
```
make hh.node
```

#### Compiling the contracts and deploying
```
make hh.deploy local
```

Unfortunately, the contracts are not deployed to Goerli or any testnet at this time

### Web
#### Getting Setup
To run the webclient you will need to ensure that you have Meta Mask installed
```
yarn 
```

You can then run the application via:
```
yarn start
```

It should start on port `3000`

## License
This repository is licensed under [MIT Open Source](https://opensource.org/licenses/MIT)

