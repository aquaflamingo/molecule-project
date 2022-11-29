# Web3 Application Scaffold
> Ethereum is v srs bzns.

A basic scaffolding template for getting started building Web3 Applications (DApps) using Hardhat, web3-react and hardhat-deploys. Basically, setting up a development environment for `CMD + C CMD + V` driven development.

This scaffolding template separates web client from the blockchain development. This create an developer environment where work can be parallelized if needed and separated between developers. It does have some drawbacks / annoyances (e.g. sharing compiled contract ABI between apps, two separate sets of `node_modules` and `package.json` dependencies), but, overall makes things a bit cleaner.

When you compile and deploy your Hardhat contracts, the compiled ABI is stored in the shared root `lib` project, which using `npm` or `yarn` package `link`s you can import into your web client as needed. This allows you, should you choose to accept your adventure, compile and deploy hardhat contract, then deploy result contract library to an internal NPM registry and pull it down in your web client.

## Create private keys
Before you can actually use your application you need to setup some Ethereum accounts. The `blockchain` project is setup to read from a local file `hardhatAccounts.json` containing preset private keys and balances.

```javascript
{
	 "accounts": [
			{
				 "address": "addressHere", 
				 "privateKey": "privateKey",
				 "balance": "10000000000000000000000"
			}
	 ]
}
```

You can do this via Metamask. 

> **NOTE** Make sure you setup MetaMask to use the Hardhat network (custom RPC via 31337) before hand.

MetaMask > Create Account > Copy private + Address

Add Private Key and Address information to `hardhatAccounts.json`. Hardhat will read from this file and initialize the local development environment using this information. In other words, the "owner" of a deployed contract will be one of these accounts.

## Setup 
You will need to `cd` into the directories and grab node modules:
```bash
cd blockchain

yarn
```

Download web modules
```bash
cd web

yarn
```

Finally, we need to create a local `yarn` link for the shared `@web3-app-scaffolding/contracts` package which will contain the compiled contract code.

```bash
cd lib

# Register the shared `lib` package for usage with other local clients
yarn link

# yarn link v1.9.2
# success Registered "@web3-app-scaffold/contracts"
# info You can now run `yarn link "@web3-app-scaffold/contracts"` in the projects where you want to use this project and it will be used instead.
```

Now back to the web client:
```bash
cd web

yarn link "@web3-app-scaffold/contracts"
```

Now that the `@web3-app-scaffolding/contracts` package is registered, we can access the contract ABI in the web client via `import`.

```javascript
import Artifacts from "@web3-app-scaffold/contracts";
const Greeter = Artifacts.contracts.Greeter;
```

## Usage
After cloning and setting up the repository you can use the `Makefile` targets to get up and running.

Starting hardhat and deploying contracts
```bash
# Starts a localhost instance of the Hardhat network
make hh.node

# Compiles and deploys your hardhat contracts
# note that by default your compiled contracts will be
# stored in the directory lib/contracts/index.json
make hh.deploy

# Finally, we can start the webclient
make web.start

# Navigate to localhost:3000 and hopefully things worked 😃
```

## License
This repository is licensed under [MIT Open Source](https://opensource.org/licenses/MIT)

