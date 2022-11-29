# Ethereum Tokens Boilerplate

For working on a new Ethereum project and needing to quickly develop and deploy dummy tokens to work with.

## Build
- Install package dependencies via `yarn`

```bash
yarn
```

- Add your mnemonic to `hardhatAccounts.dev.json`

| ⚠️  WARN:  Make sure that you 1) do not check this `.dev.json` file into source control (it's in the `.gitignore`) and 2) that if you are using $WALLET_EXTENSION (i.e. MetaMask, CB Wallet, et cetera) that you use the same password, otherwise the derived addresses will be different |
|---|

## Deploy
### Goerli
```bash
npx hardhat run scripts/deploy.js --network goerli
```

### Sepolia
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Usage 
- Acquire Testnet ETH to your mnemonic wallet's primary address (e.g. faucet)
- Customize and deploy your test tokens to testnets via deploy scripts
