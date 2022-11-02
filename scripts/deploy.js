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
  // const zsu = await ZSU.deploy("Zombie State University","ZSU","https://zsu.test","https://credits.zsu.test",deployer.address);
  // await zsu.deployed();

  // console.log(
  //   `ZST deployed to ${zsu.address}`
  // );

  var trustee;
  if (hre.network.name == 'localhost') {
    trustee = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  } else {
    trustee = '0x8E14c5610f1702c3572009D812BB93494Ba70575';
  }
  const Generator = await hre.ethers.getContractFactory("StudentIDGeneratorCodeback");
  const generator = await Generator.deploy(trustee);
  await generator.deployed();

  console.log(
    `Student ID Generator deployed to ${generator.address}`
  );

  // const VTU = await hre.ethers.getContractFactory("VTUStudentOrientation");
  // const vtu = await VTU.deploy("Vampire Tech University","VTU","https://vtu.test","https://credits.vtu.test",deployer.address, generator.address);
  // await vtu.deployed();

  // console.log(
  //   `VTU deployed to ${vtu.address}`
  // );


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
