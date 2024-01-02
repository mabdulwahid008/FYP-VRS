// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract Government{
    mapping(address => bool) private authorized;

    address private admin;

    constructor(address _admin){
        admin = _admin;
        authorized[_admin] = true;
    }

    modifier onlyAdmin(){
        require(msg.sender == admin, "VRS: Not Authorized");
        _;
    }

    function grantAuthorization(address account) public onlyAdmin{
        authorized[account] = true;
    }

    function revokeAuthorization(address account) public onlyAdmin{
        authorized[account] = false;
    }

    function isAuthorized(address account) public view returns (bool){
        return authorized[account];
    }

}