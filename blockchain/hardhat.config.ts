import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import hardhatAccounts from "./hardhatAccounts.dev.json"

const config: HardhatUserConfig = {
  solidity: "0.8.17",
	networks: {
    hardhat: {
      accounts: hardhatAccounts.hdWallet  
    },
  },
  namedAccounts: {
    deployer: 0,
    tokenOwner: 0,
  }
};

export default config;
