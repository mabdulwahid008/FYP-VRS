// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Government.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Company{

    struct CompanyStruct {
        address account;
        string name;
        string metadata;
    }

    using Counters for Counters.Counter;
    Counters.Counter private index;

    // this mapping is kept private form users, because comapnies which are not approved should be hidden from users
    mapping(uint256 => CompanyStruct) private companies;
    mapping(uint256 => bool) private isCompanyApproved;

    Government government;

    constructor(address _govenment){
        government = Government(_govenment);
    }


    // for anyone to register their comapnies
    function registerCompany(string calldata _name, string calldata _metadata) external {
        index.increment();
        uint256 currentIndex = index.current();
        companies[currentIndex] =  CompanyStruct(msg.sender, _name, _metadata);
    }

    // for government to approve comapany
    function approveCompany(uint256 index) external {
        require(government.isAuthorized(msg.sender), "VRS: Only authorized by government");
        require(!isCompanyApproved[_index], "VRS: Company already approved");

        isCompanyApproved[index] = true;
    }

    // for government to get all approved and not approved comapnies indexes
    function getAllCompaniesIndexes() external view returns (uint256[] approved, uint256[] unapproved) {
        require(government.isAuthorized(msg.sender), "VRS: Only authorized by government");

        uint256 currentIndex = index.current();

        uint256[] approvedIndexes;
        uint256[] unapprovedIndexes;

        for (uint256 i = 0; i < currentIndex; i++) {
            if(isCompanyApproved[i]){
                approvedIndexes.push(i);
            } else {
                unapprovedIndexes.push(i);
            }
        }

        return (approvedIndexes, unapprovedIndexes);
    }

    // for government to revoke approval
    function revokeApproval(uint256 index) external {
        require(government.isAuthorized(msg.sender), "VRS: Only authorized by government");
        require(isCompanyApproved[index], "VRS: Company not approved");
        isCompanyApproved[index] = false;
    }

    // anyone to get company data
    function getCompany(uint256 index) external view returns(CompanyStruct){
        require(isCompanyApproved[index], "VRS: Company not approved or does not exist");
        return companies[index];
    }


}