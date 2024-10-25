# Decentralized Proof-of-Skill Portfolio

## Overview

The **Decentralized Proof-of-Skill Portfolio** is an innovative application that leverages blockchain technology to provide users with a unique way to showcase their skills through NFTs (Non-Fungible Tokens). This project consists of a smart contract for minting skill NFTs, a Node.js backend for managing user authentication and skill tests, and a React.js frontend for user interactions.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [Backend](#backend)
- [Frontend](#frontend)
- [MongoDB Setup](#mongodb-setup)
- [Ethereum Configuration](#ethereum-configuration)
- [Running the Project](#running-the-project)
- [User Interaction](#user-interaction)
- [Additional Resources](#additional-resources)
- [License](#license)

## Features

- **Skill NFTs**: Mint NFTs to prove your skills, secured by Ethereum.
- **User Authentication**: Secure registration and login functionalities.
- **Skill Tests**: Complete tests to earn your proof of skill NFT.
- **Withdrawals**: Contract owner can withdraw earned funds.

## Technologies Used

- **Blockchain**: Ethereum, Ganache, Truffle
- **Backend**: Node.js, Express.js, Mongoose, MongoDB
- **Frontend**: React.js
- **Database**: MongoDB
- **Version Control**: Git

## Installation

To set up the project on your local machine, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/MADHAVAN-BE-2003/Engage-Hackathon.git
   cd Engage-Hackathon
   ```

2. Open a terminal and run the following command to compile, deploy, and test the smart contract and install dependencies for both server-side and client-side:

   ```bash
   npm run setup
   ```   

3. Create a `.env` file in the `server-side` directory and add your MongoDB URI:

   ```plaintext
   MONGODB_URI=your_mongodb_uri_here
   ```

## Usage

### Smart Contract

The smart contract is defined in `contracts/ProofOfSkill.sol`. It allows users to mint skill NFTs for a fee and stores the details of each skill associated with the NFT.

### Backend

The backend is responsible for user authentication and skill test management. The main server file is `server-side/app.js`.

### Frontend

The frontend is built using React.js and is located in the `client-side` directory. The main application file is `client-side/src/App.js`.

## MongoDB Setup

1. Create a MongoDB collection using the following command:

   ```bash
   mongosh blockchain_users --eval "db.createCollection(\"users\")"
   ```

2. Import the MongoDB database:

   ```bash
   mongoimport --db blockchain_users --collection users --file ./server-side/mongodb\ database/blockchain_users.users.json
   ```

## Ethereum Configuration

1. Create a new Ethereum chain in **Ganache**.
2. Select the `truffle-config.js` file to add this project to Ganache.
3. Configure **MetaMask** for the localhost chain and add the first three accounts displayed in Ganache. The first account will be used as the contract owner.

## Running the Project

### Starting the Backend Server

1. Navigate to the server-side directory and run:

   ```bash
   cd server-side
   node app.js
   ```

### Starting the React Frontend

2. In another terminal, navigate to the client-side directory and run:

   ```bash
   cd client-side
   npm start
   ```

## User Interaction

- Users can register or login using the credentials provided in the db and youtube tutorial (passwords are set to `123`).
- After logging in, users can complete tests to earn their proof of skill NFT by paying a minting fee of **0.05 ETH**.
- The contract owner can withdraw funds through their login credentials.

Certainly! Here’s the new section for your README file, which includes links for a tutorial video and the project on Devfolio:

## Additional Resources

### Tutorial Video

For a step-by-step tutorial on setting up and using the Decentralized Proof-of-Skill Portfolio, check out our YouTube video: [Watch Tutorial](https://youtu.be/Ah10HO1CMcs) _(opens in a new tab)_.

### Project on Devfolio

You can find more information about the Decentralized Proof-of-Skill Portfolio on our Devfolio project page: [View Project](https://devfolio.co/projects/decentralized-proofofskill-portfolio-3e76) _(opens in a new tab)_.

## License

This project is licensed under the MIT License. Feel free to use and modify as needed.

---

**Note**: Ensure you have all necessary software installed, including Node.js, npm, MongoDB, Ganache, and MetaMask.
