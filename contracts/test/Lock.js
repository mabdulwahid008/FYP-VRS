// Import the Hardhat Runtime Environment
const { ethers } = require("hardhat");

// Import the Chai assertion library
const { expect } = require("chai");

let government;
let company;
let vrs;
let gov_gov_admin;
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
    // Grant authorization to user1
    await government.connect(gov_admin).grantAuthorization(user1.address);

    // Check if user1 is authorized
    expect(await government.isAuthorized(user1.address)).to.equal(true);
  });

  it("Should revoke authorization from an account", async function () {
    // Grant authorization to user1
    await government.connect(gov_admin).grantAuthorization(user1.address);

    // Revoke authorization from user1
    await government.connect(gov_admin).revokeAuthorization(user1.address);

    // Check if user1 is no longer authorized
    expect(await government.isAuthorized(user1.address)).to.equal(false);
  });

  it("Should not allow unauthorized account to grant authorization", async function () {
    // Try to grant authorization from user1 (not gov_admin)
    await expect(government.connect(user1).grantAuthorization(user2.address)).to.be.revertedWith("VRS: Not Authorized");

    // Check if user2 is still not authorized
    expect(await government.isAuthorized(user2.address)).to.equal(false);
  });

  it("Should not allow unauthorized account to revoke authorization", async function () {
    // Grant authorization to user1
    await government.connect(gov_admin).grantAuthorization(user1.address);

    // Try to revoke authorization from user1 using user2 (not gov_admin)
    await expect(government.connect(user2).revokeAuthorization(user1.address)).to.be.revertedWith("VRS: Not Authorized");

    // Check if user1 is still authorized
    expect(await government.isAuthorized(user1.address)).to.equal(true);
  });
});



describe("Company Contract", function () {

  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
  });

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