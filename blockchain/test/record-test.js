const { expect } = require("chai");

describe("Token contract", function () {
  it("Return a Contract", async function () {
		 const greeterFactory = await hre.ethers.getContractFactory("Greeter");
    const greeter = await greeterFactory.deploy("hello");

    await greeter.deployed();
    expect(await greeter.greeting()).to.equal("hello");
  });
});
