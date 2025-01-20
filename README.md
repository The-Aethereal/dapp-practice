# Healthcare DApp

This is a simple decentralized application (DApp) for managing healthcare records. It allows authorized providers to add and fetch patient records.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

## Getting Started

### 1. Clone the Repository

First, clone the repository to your local machine:

```sh
git clone https://github.com/your-username/healthcare-dapp.git
cd healthcare-dapp

2. Install Dependencies

Install the necessary dependencies for the React application:

curl -L https://foundry.paradigm.sh | bash
source ~/.bashrc
cd src
npm install
npm install crypto-js ethers react web-vitals

//Note that here it is deployed using Anvil , if you want you can deploy it using RemixIDE as well.
2. Create a folder Deploying-Contract

navigate to the folder and setup
forge init --force --no-commit
now move Healthcare.sol into src/ and Deploy.sol into script/
3. Launch Anvil

Anvil is a local Ethereum development environment. Start Anvil using Foundry:

cd ..
foundryup
anvil

3. Create `.env` file and Add your private key in it.

4. Compile the Smart Contract

Navigate to the root directory and compile the Healthcare.sol smart contract:

forge build

5. Deploy the Smart Contract

Deploy the Healthcare.sol smart contract to the local Anvil network:

forge script Blockchain-Healthcare/Deploying-Contract/script/Deploy.sol --rpc-url http://127.0.0.1:8545 --private-key add_private_key --broadcast

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

Example Usage

    Authorize a Provider:
        Ensure you are connected to MetaMask and have the contract owner account selected.
        Run the authorizeProvider function with the provider's address.

    Add a Record:
        Ensure you are connected to MetaMask and have an authorized provider account selected.
        Run the addRecord function with the patient ID, name, diagnosis, and treatment.

    Fetch Records:
        Ensure you are connected to MetaMask and have an authorized provider account selected.
        Run the getPatientRecords function with the patient ID to fetch the records.


Project Structure

healthcare-dapp/
├── README.md
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── Healthcare.js
│   ├── index.css
│   └── index.js
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── package-lock.json
├── package.json
├── Healthcare.sol
├── node_modules
├── script
│   └── Deploy.s.sol
└── foundry.toml

License

This project is licensed under the MIT License - see the LICENSE file for details.
