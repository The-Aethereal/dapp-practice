import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import CryptoJS from 'crypto-js';

const Healthcare = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isPatient, setIsPatient] = useState(false);
    const [patientID, setPatientID] = useState('');
    const [patientName, setPatientName] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [patientRecords, setPatientRecords] = useState([]);
    const [providerAddress, setProviderAddress] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [error, setError] = useState('');
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const contractABI = [
		[{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"addRecord","inputs":[{"name":"patientID","type":"uint256","internalType":"uint256"},{"name":"patientName","type":"string","internalType":"string"},{"name":"diagnosis","type":"string","internalType":"string"},{"name":"treatment","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"authorizeProvider","inputs":[{"name":"provider","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getOwner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getPatientRecords","inputs":[{"name":"patientID","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"tuple[]","internalType":"struct HealthcareRecords.Record[]","components":[{"name":"recordID","type":"uint256","internalType":"uint256"},{"name":"patientName","type":"string","internalType":"string"},{"name":"diagnosis","type":"string","internalType":"string"},{"name":"treatment","type":"string","internalType":"string"},{"name":"timestamp","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"},{"type":"function","name":"getPatientRecordsByAddress","inputs":[{"name":"patientAddress","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"tuple[]","internalType":"struct HealthcareRecords.Record[]","components":[{"name":"recordID","type":"uint256","internalType":"uint256"},{"name":"patientName","type":"string","internalType":"string"},{"name":"diagnosis","type":"string","internalType":"string"},{"name":"treatment","type":"string","internalType":"string"},{"name":"timestamp","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"},{"type":"function","name":"registerPatient","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"PatientRegistered","inputs":[{"name":"patient","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ProviderAuthorized","inputs":[{"name":"provider","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RecordAdded","inputs":[{"name":"patientID","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"recordID","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"patientName","type":"string","indexed":false,"internalType":"string"},{"name":"diagnosis","type":"string","indexed":false,"internalType":"string"},{"name":"treatment","type":"string","indexed":false,"internalType":"string"},{"name":"timestamp","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false}]
    ];

    useEffect(() => {
        const connectWallet = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send('eth_requestAccounts', []);
                const signer = provider.getSigner();
                setProvider(provider);
                setSigner(signer);

                const accountAddress = await signer.getAddress();
                setAccount(accountAddress);

                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                setContract(contract);

                const ownerAddress = await contract.getOwner();
                setIsOwner(accountAddress.toLowerCase() === ownerAddress.toLowerCase());

                const isPatientRegistered = await contract.patients(accountAddress);
                setIsPatient(isPatientRegistered);

                contract.on('RecordAdded', (patientID, recordID, patientName, diagnosis, treatment, timestamp) => {
                    alert(`New record added for patient ${patientName}`);
                });

                contract.on('ProviderAuthorized', (provider) => {
                    alert(`Provider ${provider} authorized successfully`);
                });

                contract.on('PatientRegistered', (patient) => {
                    alert(`Patient ${patient} registered successfully`);
                });
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
            }
        };
        connectWallet();
    }, []);

    const registerPatient = async () => {
        try {
            const tx = await contract.registerPatient();
            await tx.wait();
            setIsPatient(true);
            alert("Patient registered successfully");
        } catch (error) {
            setError("Error registering patient: " + error.message);
        }
    };

    const fetchPatientRecords = async () => {
        try {
            const records = await contract.getPatientRecords(parseInt(patientID));
            setPatientRecords(records);
        } catch (error) {
            setError("Error fetching patient records: " + error.message);
        }
    };

    const fetchPatientRecordsByAddress = async () => {
        try {
            const records = await contract.getPatientRecordsByAddress(account);
            setPatientRecords(records);
        } catch (error) {
            setError("Error fetching patient records: " + error.message);
        }
    };

    const addRecord = async () => {
        try {
            const encryptedPatientName = encryptData(patientName, 'secretKey');
            const encryptedDiagnosis = encryptData(diagnosis, 'secretKey');
            const encryptedTreatment = encryptData(treatment, 'secretKey');

            const tx = await contract.addRecord(parseInt(patientID), encryptedPatientName, encryptedDiagnosis, encryptedTreatment);
            await tx.wait();
            fetchPatientRecords();
            alert("Record added successfully");
        } catch (error) {
            setError("Error adding records: " + error.message);
        }
    };

    const authorizeProvider = async () => {
        if (isOwner) {
            try {
                const tx = await contract.authorizeProvider(providerAddress);
                await tx.wait();
                alert(`Provider ${providerAddress} authorized successfully`);
            } catch (error) {
                setError("Error authorizing provider: " + error.message);
            }
        } else {
            alert("Only contract owner can authorize providers");
        }
    };

    const encryptData = (data, secretKey) => {
        return CryptoJS.AES.encrypt(data, secretKey).toString();
    };

    const decryptData = (encryptedData, secretKey) => {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    const filteredRecords = patientRecords.filter(record => 
        decryptData(record.patientName, 'secretKey').toLowerCase().includes(searchTerm.toLowerCase()) ||
        decryptData(record.diagnosis, 'secretKey').toLowerCase().includes(searchTerm.toLowerCase()) ||
        decryptData(record.treatment, 'secretKey').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode');
    };

    return (
        <div className='container'>
            <h1 className='title'>HealthCare Application</h1>
            {account && <p className='account-info'>Connected Account: {account}</p>}
            {isOwner && <p className='owner-info'>You are the contract owner</p>}
            {isPatient && <p className='patient-info'>You are a registered patient</p>}
            {!isPatient && (
                <button className='action-button' onClick={registerPatient}>Register as Patient</button>
            )}

            <div className='form-section'>
                <h2>Fetch Patient Records</h2>
                <input className='input-field' type='text' placeholder='Enter Patient ID' value={patientID} onChange={(e) => setPatientID(e.target.value)} />
                <button className='action-button' onClick={fetchPatientRecords}>Fetch Records</button>
                <button className='action-button' onClick={fetchPatientRecordsByAddress}>Fetch My Records</button>
            </div>

            <div className='form-section'>
                <h2>Add Patient Record</h2>
                <input className='input-field' type='text' placeholder='Patient Name' value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                <input className='input-field' type='text' placeholder='Diagnosis' value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                <input className='input-field' type='text' placeholder='Treatment' value={treatment} onChange={(e) => setTreatment(e.target.value)} />
                <button className='action-button' onClick={addRecord}>Add Record</button>
            </div>

            <div className='form-section'>
                <h2>Authorize Healthcare Provider</h2>
                <input className='input-field' type='text' placeholder='Provider Address' value={providerAddress} onChange={(e) => setProviderAddress(e.target.value)} />
                <button className='action-button' onClick={authorizeProvider}>Authorize Provider</button>
            </div>

            <div className='form-section'>
                <h2>Search Records</h2>
                <input className='input-field' type='text' placeholder='Search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className='records-section'>
                <h2>Patient Records</h2>
                {filteredRecords.map((record, index) => (
                    <div key={index}>
                        <p>Record ID: {record.recordID.toNumber()}</p>
                        <p>Patient Name: {decryptData(record.patientName, 'secretKey')}</p>
                        <p>Diagnosis: {decryptData(record.diagnosis, 'secretKey')}</p>
                        <p>Treatment: {decryptData(record.treatment, 'secretKey')}</p>
                        <p>Timestamp: {new Date(record.timestamp.toNumber() * 1000).toLocaleString()}</p>
                    </div>
                ))}
            </div>

            {error && <p className='error-message'>{error}</p>}
            <button className='action-button' onClick={toggleDarkMode}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
        </div>
    );
};

export default Healthcare;