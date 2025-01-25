# Healthcare DApp

This project is a decentralized healthcare application that allows patients to register, manage, and healthcare providers to manage, and interact with smart contracts.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Running](#running)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Deployment](#deployment)
- [Project_Structure](#Project_Structure)
- [License](#license)

 ## Introduction

The Blockchain Healthcare Application is designed to provide a secure and transparent way to manage patient records. It leverages smart contracts to ensure data integrity and access control. The application includes features for registering patients, adding records, and authorizing healthcare providers.

## Features
### 1. **Patient Registration**
- **Description**: Patients can register themselves on the blockchain. Once registered, patients can manage their records and view their own health information.
- **Usage**: Click the "Register as Patient" button to register yourself on the blockchain.

### 2. **Record Management**
- **Description**: Authorized healthcare providers can add, view, and manage patient records. Each record includes the patient's name, diagnosis, treatment, and timestamp.
- **Usage**:
  - **Add Record**: Enter the patient's ID, name, diagnosis, and treatment, then click "Add Record".
  - **Fetch Records**: Enter the patient's ID and click "Fetch Records" to view the patient's records.
  - **Fetch My Records**: Click "Fetch My Records" to view your own records.

### 3. **Access Control**
- **Description**: The application ensures that only authorized providers can add records, and only registered patients can view their own records. This provides a secure and controlled environment for managing sensitive health information.
- **Usage**:
  - **Authorize Provider**: Enter the provider's address and click "Authorize Provider" to authorize them to add records.

### 4. **Event Logging**
- **Description**: The application emits events for key actions such as patient registration, provider authorization, and record addition. These events can be used for auditing and logging purposes.
- **Usage**: Events are automatically emitted and can be monitored using blockchain explorers or event listeners in the application.

### 5. **Dark Mode**
- **Description**: The application supports a dark mode for better user experience, especially in low-light environments. Users can toggle between light and dark modes.
- **Usage**: Click the "Dark Mode" button to switch between light and dark modes.

### 6. **Loading Indicators**
- **Description**: The application provides visual feedback during loading states to enhance user experience. Loading indicators are displayed while fetching records, adding records, and authorizing providers.
- **Usage**: Loading indicators are automatically shown during loading states and disappear once the action is complete.

### 7. **Tooltips for Form Fields**
- **Description**: Tooltips are provided for form fields to offer additional context or instructions. This helps users understand the required input and reduces errors.
- **Usage**: Hover over form fields to see tooltips with additional information.

### 8. **Animated Background**
- **Description**: The application features an animated background to enhance the visual appeal and user engagement. The background animation is subtle and does not distract from the main content.
- **Usage**: The animated background is automatically displayed when the application is loaded.

![image](https://github.com/user-attachments/assets/148521b2-cdd4-46fc-80e7-8925106a9f0b)

## Running 
1. npm install
2. Update the smart contract address and abi in Healthcare.js file.
3. npm start

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

## Installation

### 1. Clone the Repository

First, clone the repository to your local machine:

```sh
git clone https://github.com/your-username/healthcare-dapp.git
cd healthcare-dapp
```
2. Install Dependencies

Install the necessary dependencies for the React application:
```sh
curl -L https://foundry.paradigm.sh | bash
source ~/.bashrc
cd src
npm install
npm install crypto-js ethers react web-vitals
```
## Deployment

//Note that here it is deployed using Anvil , if you want you can deploy it using RemixIDE as well.

1. Create a folder Deploying-Contract

navigate to the folder and setup
```sh
forge init --force --no-commit
```
now move Healthcare.sol into src/ and Deploy.sol into script/
2. Launch Anvil

Anvil is a local Ethereum development environment. Start Anvil using Foundry:
```sh
cd ..
foundryup
anvil
```
3. Create `.env` file and Add your private key in it.

4. Compile the Smart Contract

Navigate to the root directory and compile the Healthcare.sol smart contract:
```sh
forge build
```
5. Deploy the Smart Contract

Deploy the Healthcare.sol smart contract to the local Anvil network:
```sh
forge script Blockchain-Healthcare/Deploying-Contract/script/Deploy.sol --rpc-url http://127.0.0.1:8545 --private-key add_private_key --broadcast
```
After deployment, you will see the contract address in the terminal output. Note this address, as you will need it later.

6. Integrate with React Application
6.1 Update Healthcare.js

Open the src/Healthcare.js file and update the contractAddress with the address you noted from the deployment step. Also, ensure the contractABI is correctly defined.
You can copy the ABI from Deploying-Contract/out/Healthcare.sol/HealthcareRecords.json
const contractAddress = "YOUR_CONTRACT_ADDRESS";

6.2 Run the React Application

Start the React application:

cd src
npm start

7. Connect to MetaMask

Ensure you have MetaMask installed in your browser and connected to the local Anvil network (usually http://127.0.0.1:8545).
8. Use the DApp

    Fetch Patient Records: Enter a patient ID and click "Fetch Records" to see the patient's records.
    Add Patient Record: Enter the patient's name, diagnosis, and treatment, then click "Add Record" to add a new record.
    Authorize Healthcare Provider: Enter a provider's address and click "Authorize Provider" to grant them access to add records.

## Usage

    Authorize a Provider:
        Ensure you are connected to MetaMask and have the contract owner account selected.
        Run the authorizeProvider function with the provider's address.

    Add a Record:
        Ensure you are connected to MetaMask and have an authorized provider account selected.
        Run the addRecord function with the patient ID, name, diagnosis, and treatment.

    Fetch Records:
        Ensure you are connected to MetaMask and have an authorized provider account selected.
        Run the getPatientRecords function with the patient ID to fetch the records.


## Project_Structure

Blockchain-Healthcare/
├── .env
├── .gitignore
├── README.md
├── foundry.toml
├── package.json
├── package-lock.json
├── script/
│   └── Deploy.sol
├── src/
│   ├── HealthcareRecords.sol
│   └── Healthcare.js
├── public/
│   ├── index.html
│   └── manifest.json
├── tests/
│   └── HealthcareRecords.t.sol
├── lib/
│   └── forge-std/
├── .vscode/
│   └── settings.json
└── App.css

## License

This project is licensed under the MIT License - see the LICENSE file for details.
