import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './../styles/Test.css';
import Web3 from 'web3';
import Artifacts from './../contract/ProofOfSkill.json';

const contractAddress = Artifacts.networks[5777].address;
const ProofOfSkillABI = Artifacts.abi;

const Test = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const skill = query.get('skill');
    const difficulty = query.get('difficulty');

    const [response, setResponse] = useState('');
    const [question, setQuestion] = useState('');
    const [code, setCode] = useState('');
    const [result, setResult] = useState('');
    const [completedTests, setCompletedTests] = useState(JSON.parse(localStorage.getItem('completedTests')) || []);

    useEffect(() => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else {
            alert('Please install MetaMask to use this feature!');
        }
    }, []);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/test/question', {
                    params: { skill, difficulty }
                });
                setQuestion(response.data.question);
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };

        fetchQuestion();
    }, [skill, difficulty]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const startTime = Date.now();
            const response = await axios.post(
                'http://localhost:5000/api/test/submit',
                { skill, difficulty, code },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log(`API response time: ${Date.now() - startTime} ms`);
            setResult(response.data.result);
            setResponse(response.data.success);

            if (response.data.success) {
                const newCompletedTests = [...completedTests, { skill, difficulty }];
                setCompletedTests(newCompletedTests);
                localStorage.setItem('completedTests', JSON.stringify(newCompletedTests));

                const skillCompletions = newCompletedTests.filter(test => test.skill === skill);
                const difficultiesCompleted = skillCompletions.map(test => test.difficulty);
                const allDifficulties = ['Easy', 'Medium', 'Hard'];
                const hasCompletedAllDifficulties = allDifficulties.every(diff => difficultiesCompleted.includes(diff));

                if (hasCompletedAllDifficulties) {
                    await mintNFT(skill); // Call mintNFT with skill
                } else {
                    alert('Complete all three difficulty levels (Easy, Medium, Hard) to mint the NFT.');
                }

                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            } else {
                setResult('Try again');
            }
        } catch (error) {
            console.error('Error submitting code:', error);
            if (error.response) {
                console.error('Response error:', error.response.data);
            }
        }
    };

    const mintNFT = async (skill) => {
        if (typeof window.ethereum !== 'undefined') {
            window.web3 = new Web3(window.ethereum);
        } else {
            alert('MetaMask is required to use this feature.');
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];

            // Set the minting fee in Wei
            const mintingFee = 0.05; // Example fee in ETH
            const valueInWei = window.web3.utils.toWei(mintingFee.toString(), 'ether');

            // Choose the tokenURI based on the skill
            const tokenURI = skill === 'Node.js'
                ? 'https://res.cloudinary.com/du6vmyvdh/raw/upload/v1729785803/Blockchain/metadata-node-js_l2iqyy.json'
                : 'https://res.cloudinary.com/du6vmyvdh/raw/upload/v1729785806/Blockchain/metadata-react-js_gc8dsp.json';

            // Mint the NFT using Web3 and MetaMask
            const contract = new window.web3.eth.Contract(ProofOfSkillABI, contractAddress);
            const mintResponse = await contract.methods.mintSkillNFT(userAddress, skill, tokenURI)
                .send({ from: userAddress, value: valueInWei });

            console.log('NFT Minted:', mintResponse);
            alert('NFT successfully minted for completing all difficulty levels of ' + skill + '!');
        } catch (error) {
            handleError(error); // Handle specific errors
        }
    };

    const handleError = (error) => {
        if (error.code === 4001) {
            alert('Transaction rejected by the user.');
        } else if (error.code === -32603) {
            alert('Internal JSON-RPC error. Check MetaMask connection or network.');
        } else {
            alert('An error occurred: ' + error);
        }
        console.error('Error:', error);
    };

    return (
        <div className="test">
            <h2>{skill} Test - {difficulty}</h2>
            <h3 className='question-heading'>Question:</h3>
            <p className='question'>{question || 'Loading...'}</p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Write your code here..."
                    rows="10"
                    cols="50"
                    required
                />
                <div className='submit-section'>
                    <button type="submit" className='submit'>Submit</button>
                    {result && (
                        <h4 className={response ? 'result-success' : 'result-failure'}>
                            Result: {result}
                        </h4>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Test;
