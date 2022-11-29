require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy-ethers");
require("hardhat-deploy");
const hardhatAccounts = require("./hardhatAccounts")

const HH_NETWORK_ID = 31337

task("accounts", "Prints the list of accounts", async () => {
	 const accounts = await ethers.getSigners();

	 for (const account of accounts) {
			console.log(account.address);
	 }
});

module.exports = {
	 solidity: "0.8.4",
	 networks: {
			hardhat: {
				 accounts: hardhatAccounts.accounts 
			}
	 },
	 namedAccounts: {
			deployer: 0,
			tokenOwner: 0,
	 }
};

