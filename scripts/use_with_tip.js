// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [tester] = await ethers.getSigners();

  const Generator = await hre.ethers.getContractFactory("StudentIDGenerator");
  const generator = await Generator.deploy();
  await generator.deployed();

  console.log(`Student ID Generator deployed to ${generator.address}`);

  console.log(`Generator Forkback balance is now ${await generator.balance()} ETH`);
  
  options = {
    value: ethers.utils.parseEther('0.002')
  };

  const studentId = await generator.setStudentId(3, generator.address, options);

  console.log(`Your Student ID is ${JSON.stringify(studentId)}`);

  console.log(`Generator Forkback balance is now ${await generator.balance()} ETH`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
