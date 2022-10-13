// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // const ZSU = await hre.ethers.getContractFactory("ZSUStudentOrientation");
  // const zsu = await ZSU.deploy("Zombie State Test","ZST","https://zst.test","https://credits.zst.test",deployer.address);
  // await zsu.deployed();

  // console.log(
  //   `ZST deployed to ${zsu.address}`
  // );

  const Generator = await hre.ethers.getContractFactory("StudentIDGenerator");
  const generator = await Generator.deploy({
    gasLimit: 3e7
  });
  await generator.deployed();

  console.log(
    `Student ID Generator deployed to ${generator.address}`
  );

  const ZSUF = await hre.ethers.getContractFactory("ZSUStudentOrientationForkback");
  const zsuf = await ZSUF.deploy("Zombie State Test","ZST","https://zst.test","https://credits.zst.test",deployer.address, generator.address, {
    gasLimit: 3e7
  });
  await zsuf.deployed();

  console.log(
    `ZSTF deployed to ${zsuf.address}`
  );


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
