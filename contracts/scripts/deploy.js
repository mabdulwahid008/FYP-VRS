const { ethers } = require("hardhat");

async function main() {

  const admin = '0x35111A4004091A20818012926A405eDF24660B82'
  // const admin = '0xA785b969469D1A5e752E82d39d69668F5A327e6D'

  const governmentContract = await ethers.deployContract("Government", [admin]);
  const govReceipt = await governmentContract.waitForDeployment();
  const governmentAddress = govReceipt.target;
  console.log("Government Address is "+ governmentAddress);
  

  const companyContract = await ethers.deployContract("Company", [governmentAddress]);
  const companyReceipt = await companyContract.waitForDeployment();
  const companyAddress = companyReceipt.target;
  console.log("Company Address is "+ companyAddress);


  const VRSContract = await ethers.deployContract("VRS", [companyAddress, governmentAddress]);
  const VRSReceipt = await VRSContract.waitForDeployment();
  const VRSAddress = VRSReceipt.target;
  console.log("VRS Address is "+ VRSAddress);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});