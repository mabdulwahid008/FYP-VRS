// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Government.sol";

contract Company{

    struct CompanyStruct {
        address account;
        string name;
        string metadata;
    }

    uint256 private INDEX;

    // this mapping is kept private form users, because comapnies which are not approved should be hidden from users
    mapping(uint256 => CompanyStruct) public companies;
    mapping(address => bool) public isCompanyApproved;

    event Register(uint256 index, address account, string name, uint256 timestamp);
    event Approved(uint256 index, address account, string name, uint256 timestamp);
    event revokedApprovel(uint256 index, address account, string name, uint256 timestamp);

    Government government;

    constructor(address _govenment){
        government = Government(_govenment);
    }

    // for anyone to register their comapnies
    function registerCompany(string calldata _name, string calldata _metadata) external {
        uint256 currentIndex = INDEX;
        companies[currentIndex] =  CompanyStruct(msg.sender, _name, _metadata);

        emit Register(currentIndex, msg.sender, _name, block.timestamp);
        INDEX++;

    }

    modifier onlyGovernmentAuthorized() {
        require(government.isAuthorized(msg.sender), "VRS: Only authorized by government");
        _;
    }

    // for government to approve comapany
    function approveCompany(uint256 _index) external onlyGovernmentAuthorized{
        CompanyStruct memory company = companies[_index];
        require(!isCompanyApproved[company.account], "VRS: Company already approved");
        isCompanyApproved[company.account] = true;

        emit Approved(_index, company.account, company.name, block.timestamp);
    }


    // for government to revoke approval
    function revokeApproval(uint256 _index) external onlyGovernmentAuthorized{
        CompanyStruct memory company = companies[_index];
        require(isCompanyApproved[company.account], "VRS: Company not approved");
        isCompanyApproved[company.account] = false;

        emit revokedApprovel(_index, company.account, company.name, block.timestamp);
    }

    // anyone to get company data
    function getCompany(uint256 _index) external view returns(CompanyStruct memory){
        CompanyStruct memory company = companies[_index];
        require(isCompanyApproved[company.account], "VRS: Company not approved or does not exist");
        return companies[_index];
    }

    // for government to get all approved and not approved comapnies indexes
    function getAllCompaniesIndexes() external view onlyGovernmentAuthorized returns (uint256[] memory approved, uint256[] memory unapproved) {
        uint256 currentIndex = INDEX;

        uint256 approvedCount = 0;
        uint256 unapprovedCount = 0;


        uint256[] memory approvedIndexes = new uint256[](approvedCount);
        uint256[] memory unapprovedIndexes = new uint256[](unapprovedCount);

        for (uint256 i = 0; i < currentIndex; i++) {
            if (isCompanyApproved[companies[i].account]) {
                approvedIndexes[approvedCount++] = i;
            } else {
                unapprovedIndexes[unapprovedCount++] = i;
            }
        }

        return (approvedIndexes, unapprovedIndexes);
    }
}