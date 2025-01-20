// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract HealthcareRecords {
    address owner;

    struct Record {
        uint256 recordID;
        string patientName;
        string diagnosis;
        string treatment;
        uint256 timestamp;
    }

    mapping(uint256 => Record[]) private patientRecords;
    mapping(address => bool) private authorizedProviders;
    mapping(address => bool) private patients;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this function");
        _;
    }

    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender], "Not an authorized provider");
        _;
    }

    modifier onlyPatient(uint256 patientID) {
        require(patients[msg.sender], "Not a registered patient");
        require(patientID == uint256(uint160(msg.sender)), "Not the correct patient");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function authorizeProvider(address provider) public onlyOwner {
        authorizedProviders[provider] = true;
        emit ProviderAuthorized(provider);
    }

    function registerPatient() public {
        patients[msg.sender] = true;
        emit PatientRegistered(msg.sender);
    }

    function addRecord(uint256 patientID, string memory patientName, string memory diagnosis, string memory treatment) public onlyAuthorizedProvider {
        uint256 recordID = patientRecords[patientID].length + 1;
        patientRecords[patientID].push(Record(recordID, patientName, diagnosis, treatment, block.timestamp));
        emit RecordAdded(patientID, recordID, patientName, diagnosis, treatment, block.timestamp);
    }

    function getPatientRecords(uint256 patientID) public view onlyPatient(patientID) returns (Record[] memory) {
        return patientRecords[patientID];
    }

    function getPatientRecordsByAddress(address patientAddress) public view onlyAuthorizedProvider returns (Record[] memory) {
        uint256 patientID = uint256(uint160(patientAddress));
        return patientRecords[patientID];
    }

    event ProviderAuthorized(address provider);
    event PatientRegistered(address patient);
    event RecordAdded(uint256 patientID, uint256 recordID, string patientName, string diagnosis, string treatment, uint256 timestamp);
}