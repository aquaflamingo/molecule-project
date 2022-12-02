# Molecule DAO

For working on a new Ethereum project and needing to quickly develop and deploy dummy tokens to work with.

## Build
- Install package dependencies via `yarn`

```bash
yarn
```

- Add your mnemonic to `hardhatAccounts.dev.json`

## Usage 
- Acquire Testnet ETH to your mnemonic wallet's primary address (e.g. faucet)
- Customize and deploy your test tokens to testnets via deploy scripts

## Testing
Ensure that the hardhat node is running via `make -C ../ hh.node`

Then run tests via `yarn test`.

## Deploy
### Goerli
```bash
npx hardhat run scripts/deploy.js --network goerli
```

### Sepolia
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Contract ABI Export
- There is a small hook inside of the contract deploy script which writes via `fs` to the `web` directory the contract artifacts for use

