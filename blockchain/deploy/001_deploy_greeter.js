module.exports = async (hre) => {
	 const {deployments, getNamedAccounts} = hre;
	 const {deploy} = deployments;

	 const {deployer, tokenOwner} = await getNamedAccounts();

	 await deploy('Greeter', {
			// Greeter is owner (for now)
			from: deployer,
			args: ["Hello web3-app-scaffold"],
			log: true
	 });
};

module.exports.tags = ['Greeter'];

