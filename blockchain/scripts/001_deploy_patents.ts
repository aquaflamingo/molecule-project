import { ethers } from "hardhat";
import fs from "fs"

const OUTPATH = "../web/src/artifacts/deploy.json"

async function main() {
	const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Patents = await ethers.getContractFactory("Patent");
  const patents = await Patents.deploy();

  console.log("NFT address:", patents.address);

	return patents
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().then((result) => {
	fs.writeFileSync(OUTPATH, JSON.stringify({ address: result.address }))
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
