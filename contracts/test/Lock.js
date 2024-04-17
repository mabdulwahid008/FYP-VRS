// Import the Hardhat Runtime Environment
const { ethers } = require("hardhat");

// Import the Chai assertion library
const { expect } = require("chai");

let government;
let company;
let vrs;
let gov_admin;
let user1;
let user2;


async function deployGovernment(gov_admin) {
  let Government = await ethers.getContractFactory("Government");
  Government = await Government.deploy(gov_admin.address);
  return  Government 
}

async function deployCompany() {
  let Company = await ethers.getContractFactory("Company");
  Company = await Company.deploy(government.target);
  return  Company
}

async function deployVRS() {
  let VRS = await ethers.getContractFactory("VRS");
  VRS = await VRS.deploy(company.target, government.target);
  return  VRS 
}

describe("Government Contract", function () {

  before(async function () {
    [gov_admin, user1, user2] = await ethers.getSigners();
    government = await deployGovernment(gov_admin);
    company = await deployCompany();
    vrs = await deployVRS();
  });

  it("Should grant authorization to an account", async function () {
    await government.connect(gov_admin).grantAuthorization(user1.address);
    expect(await government.isAuthorized(user1.address)).to.equal(true);
  });

  it("Should revoke authorization from an account", async function () {
    await government.connect(gov_admin).grantAuthorization(user1.address);
    await government.connect(gov_admin).revokeAuthorization(user1.address);
    expect(await government.isAuthorized(user1.address)).to.equal(false);
  });

  it("Should not allow unauthorized account to grant authorization", async function () {
    await expect(government.connect(user1).grantAuthorization(user2.address)).to.be.revertedWith("VRS: Not Authorized");
    expect(await government.isAuthorized(user2.address)).to.equal(false);
  });

  it("Should not allow unauthorized account to revoke authorization", async function () {
    await government.connect(gov_admin).grantAuthorization(user1.address);
    await expect(government.connect(user2).revokeAuthorization(user1.address)).to.be.revertedWith("VRS: Not Authorized");
    expect(await government.isAuthorized(user1.address)).to.equal(true);
  });
});



describe("Company Contract", function () {

  it("Should register a company", async function () {
    const companyName = "Test Company";
    const companyMetadata = "Some metadata"
    await company.connect(user1).registerCompany(companyName, companyMetadata);
    await company.connect(gov_admin).approveCompany(0);
    const companyData = await company.getCompany(0);
    expect(companyData.account).to.equal(user1.address);
    expect(companyData.name).to.equal(companyName);
    expect(companyData.metadata).to.equal(companyMetadata);
  });

  it("Should revoke approval of a company by government", async function () {
    await company.connect(user1).registerCompany("Test Company", "Some metadata");
    await company.connect(gov_admin).revokeApproval(0);
    const isApproved = await company.isCompanyApproved(user1.address);
    expect(isApproved).to.be.false;
  });

  it("Should revoke approve of a company by government", async function () {
    await company.connect(user1).registerCompany("Test Company", "Some metadata");
    await company.connect(gov_admin).approveCompany(0);
    const isApproved = await company.isCompanyApproved(user1.address);
    expect(isApproved).to.be.true;
  });

})



describe("VRS Contract", function () {

  
  it("Should register a new vehicle", async function () {
    await company.connect(user1).registerCompany("Test Company", "Some metadata");
    await vrs.connect(user1).registerNewVhecile("Vehicle Metadata", "Chassis Number");
    const vehicle = await vrs.vehicles(0);
    expect(vehicle.vehicleCompany).to.equal(user1.address);
    expect(vehicle.vehicleMetadata).to.equal("Vehicle Metadata");
    expect(vehicle.vehicleChassisNumber).to.equal("Chassis Number");
    expect(vehicle.currentOwner).to.equal("0x0000000000000000000000000000000000000000"); 
  });


  it("Should create and accept an offer", async function () {
    await company.connect(user1).registerCompany("Test Company", "Some metadata");
    await vrs.connect(user1).registerNewVhecile("Vehicle Metadata", "Chassis Number");
    await vrs.connect(user1).createOffer(0, user2.address, ethers.parseEther("1"), Math.floor(Date.now() / 1000) + 3600);
    const initialBalanceUser2 = await ethers.provider.getBalance(user2.address)
    await vrs.connect(user2).acceptOffer(0, "New Owner Metadata", ethers.parseEther("1"), { value: ethers.parseEther("1"), gasLimit: 200000 });
    const vehicle = await vrs.vehicles(0);
    expect(vehicle.currentOwner).to.equal(user2.address); // verfying transfership transferred
    expect(vehicle.currentOwnerMetadata).to.equal("New Owner Metadata"); // verifying the new owner's metadat
    const finalBalanceUser2 =  await ethers.provider.getBalance(user2.address)
    expect(initialBalanceUser2).to.be.above(finalBalanceUser2); // User2 balance should decrease after accepting offer
  });
})