import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
	// We define a fixture to reuse the same setup in every test.
	// We use loadFixture to run this setup once, snapshot that state,
	// and reset Hardhat Network to that snapshot in every test.
	async function deployPatent() {
		// Contracts are deployed using the first signer/account by default
		const [owner, otherAccount] = await ethers.getSigners();

		const Patent = await ethers.getContractFactory("Patent");
		const patent = await Patent.deploy();

		return { patent, owner, otherAccount };
		}

	describe("Deployment", () => {
		it("Should set the right owner", async () => {
			const { patent, owner } = await loadFixture(deployPatent);

			expect(await patent.owner()).to.equal(owner.address);
		});
	});

	describe("Brightlist", () => {
		describe("Additions", () => {
			it("Adds to brightlist", async () => {
				const { patent, owner, otherAccount } = await loadFixture(deployPatent);

				await patent.addToBrightlist([otherAccount.address])

				expect(await patent.brightlist(otherAccount.address)).to.equal(true)
				expect(await patent.brightlist(owner.address)).to.equal(false)
			})

			it("Requires owner", async () => {
				const { patent, owner, otherAccount } = await loadFixture(deployPatent);

				const randomAddress = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'

				await expect(patent.connect(otherAccount).addToBrightlist([randomAddress])).to.be.revertedWith(
					"Ownable: caller is not the owner"
				);
			})
		})

		describe("Removal", () => {
			var _patent : Contract 
			var _owner : any 
			var _otherAccount : any 

			// Add to brightlist
			beforeEach(async () => {
				const { patent, owner, otherAccount } = await loadFixture(deployPatent);

				await patent.addToBrightlist([otherAccount.address])

				_patent = patent
				_owner = owner
				_otherAccount = otherAccount
			})

			it("Removes from brightlist", async () => {
				// Verify it is already added
				expect(await _patent.brightlist(_otherAccount.address)).to.equal(true)

				// Remove it
				await _patent.removeFromBrightlist([_otherAccount.address])

				// Verify it was removed
				// expect(await patent.brightlist(otherAccount.address)).to.equal(false)
			})

			it("Requires owner", async () => {
				await expect(_patent.connect(_otherAccount).removeFromBrightlist([_otherAccount.address])).to.be.revertedWith(
					"Ownable: caller is not the owner"
				);
			})
		})
	})
});
