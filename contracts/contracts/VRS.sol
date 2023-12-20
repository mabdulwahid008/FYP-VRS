// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import './Company.sol';
import './Government.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

contract VRS{
    Company company;
    Government government;

    uint256 private INDEX;

    struct Vehicle {
        string vehicleNumber;
        string vehicleMetadata;
        string vehicleChassisNumber;
        address vehicleCompany;
        address currentOwner;
        string currentOwnerMetadata;
    }

    mapping(address => uint256[]) public ownerToVehicles; // given addres returns IDs Owned by Address
    mapping(uint256 => Vehicle) public vehicles; // given ID returns VEHICLE

    // this is for owner to list vehicle to buyer for specific time period to acceot the offer
    struct Offer{
        address seller;
        address buyer;
        uint256 price;
        uint256 tillTime;
    }

    mapping(uint256 => Offer) public sellerOffer;

    uint256 public registrationFee;

    event VehicleRegistered(uint256 vehicleId, address company, string vehicleChassisNumber, string vehicleMetadata, address owner);
    event SellerOffer(uint256 vehicleId,  address seller, address buyer, uint256 price, uint256 tillTime);
    event TransferFrom(uint256 vehicleId,  address from, address to, string vehicleNumber, string vehicleChassisNumber, address company);

    constructor(address _company, address _government){
        company = Company(_company);
        government = Government(_government);
    }

    modifier onlyCompany() {
        require(company.isCompanyApproved(msg.sender), "VRS: Only callable by the company.");
        _;
    }

    // for a company to register new variant
    function registerNewVhecile(string calldata metadata, string calldata chassis_number) external onlyCompany{
        uint256 id = INDEX;
        vehicles[id] = Vehicle('', metadata, chassis_number, msg.sender, address(0), '');

        emit VehicleRegistered(id, msg.sender, chassis_number, metadata, address(0) );

        INDEX++;
    }

    // this method is for company and user to creat an offer for buyer
    // ethier it is new vehicle or used 
    function createOffer(uint256 vehicleId, address _buyer, uint256 _price, uint256 _tillTime) external {
        Vehicle memory vehicle = vehicles[vehicleId];

        // case 1: if vehicle is not owned and msg.sender is not company then => return
        require(vehicle.currentOwner == address(0) && company.isCompanyApproved(msg.sender), 'VRS: You are not the owner of this vehicle.');
        // case 2: if vehicle is owned and msg.sender is not the owner then => return
        require(vehicle.currentOwner != address(0) && vehicle.currentOwner == msg.sender, 'VRS: You are not the owner of this vehicle.');

        require(_tillTime > block.timestamp, 'VRS: Time period is invalid.');
   
        sellerOffer[vehicleId] = Offer(msg.sender, _buyer, _price, _tillTime);

        emit SellerOffer(vehicleId, msg.sender, _buyer, _price, _tillTime);

    }

    // this method is for buyers to accept the offer and own the vehicle in very next second
    function acceptOffer(uint256 vehicleId, string calldata metadata, uint256 amount) payable external {
        Offer memory offer = sellerOffer[vehicleId];
        require(offer.tillTime > block.timestamp, 'VRS: Offer expired.');
        require(offer.buyer == msg.sender, 'VRS: In valid address');
        require(amount == offer.price, 'VRS: Amount sent is icorrect');

        address seller = offer.seller;
        (bool sent, ) = seller.call{value: amount}("");
        require(sent, 'VRS: Amount could not be sent to the seller.');

        Vehicle storage vehicle = vehicles[vehicleId];
        if(vehicle.currentOwner == address(0)){
            // string memory vehicleNumber = genrateRandomRegistrationString();
            string memory vehicleNumber = '';
            vehicle.vehicleNumber = vehicleNumber;
        }

        vehicle.currentOwner = msg.sender;
        vehicle.currentOwnerMetadata = metadata;

        emit TransferFrom(vehicleId, seller, msg.sender, vehicle.vehicleNumber, vehicle.vehicleChassisNumber, vehicle.vehicleCompany);

        delete sellerOffer[vehicleId];
    }

    function genrateRandomRegistrationString() private returns(string memory){

        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 10000;

        string memory number = string.concat('PAK', Strings.toString(randomNumber));

        return number;
    }


    receive() external payable {
    }
}