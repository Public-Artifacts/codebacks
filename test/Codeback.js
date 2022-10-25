const { expect } = require("chai");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Codeback Contract", function() {
  async function deployCodebackFixture() {
    var signer;
    var trustee;
    if (hre.network.name == 'localhost') {
      [signer, trustee] = await ethers.getSigners();
    } else {
      [signer] = await ethers.getSigners();
      const trusteeAddr = '0x8E14c5610f1702c3572009D812BB93494Ba70575';
      trustee = await ethers.getSigner(trusteeAddr);
    }
    const Generator = await hre.ethers.getContractFactory("StudentIDGeneratorCodeback");
    

    const generator = await Generator.deploy(trustee.address);
    await generator.deployed();

    return {Generator, generator, signer, trustee};
  }

  describe("Deployment", function() {
    it("Should have me as the signer", async function() {
      const {generator, signer} = await loadFixture(deployCodebackFixture);
      expect(await generator.signer.address).to.equal(signer.address);
    });

    it("Should have the right trustee", async function() {
      const {generator, trustee} = await loadFixture(deployCodebackFixture);
      expect(await generator.trustee()).to.equal(trustee.address);
    });
  });

  describe("Accepts Tips", function() {
    

    it("Should accept ETH tips", async function() {
      
      const {generator, signer} = await loadFixture(deployCodebackFixture);
      let amtInEther = "0.1";
      let tx = {
        to: generator.address,
        value: ethers.utils.parseEther(amtInEther)
      };
      await signer.sendTransaction(tx);
      expect(await generator.balance()).to.equal(ethers.utils.parseEther(amtInEther)); 
      expect()
    });

    it("Should allow trustee to withdraw ETH tips", async function() {
      const {generator, signer, trustee} = await loadFixture(deployCodebackFixture);
      let amtInEther = "0.1";
      let tx = {
        to: generator.address,
        value: ethers.utils.parseEther(amtInEther)
      };
      await signer.sendTransaction(tx);
      await generator.connect(trustee).withdraw(ethers.utils.parseEther(amtInEther), trustee.address);
      expect(await generator.balance()).to.equal(0);
    });

    it("Should not allow anyone else to withdraw ETH tips", async function() {
      const {generator, signer, trustee} = await loadFixture(deployCodebackFixture);
      let amtInEther = "0.1";
      let tx = {
        to: generator.address,
        value: ethers.utils.parseEther(amtInEther)
      };
      await signer.sendTransaction(tx);
      await expect(generator.connect(signer.address).withdraw(ethers.utils.parseEther(amtInEther), trustee.address)).to.be.rejectedWith("Only the trustee can withdraw funds");
      // balance shouldn't have change
      expect(await generator.balance()).to.equal(ethers.utils.parseEther(amtInEther));
    });

    // TO DO: 
    // Should accept ERC20 tips
    // Should allow trustee to withdraw ERC20 tips
    // Should not allow anyone else to withdraw ERC20 tips
    // Should accept ERC721 tips
    // Should allow trustee to withdraw ERC721 tips
    // Should not allow anyone else to withdraw ERC721 tips
    // Trustee can change trustee
    // Nobody else can change trustee
    // Codeback emits events
    // Anyone can call Codeback
    // New ZSU contract mints using Codeback
  });
});