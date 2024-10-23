import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './../styles/Test.css';
import Web3 from 'web3';
// import abi from './../ProofOfSkill.json';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const ProofOfSkillABI = [];

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

    // Initialize Web3
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

    const handleMintNFT = async (skill, difficulty, tokenURI) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token
            const response = await axios.post(
                'http://localhost:5000/api/nft/mint',
                {
                    skillName: skill,
                    difficulty,
                    tokenURI
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in headers
                    }
                }
            );

            console.log('NFT Minted:', response.data);
        } catch (error) {
            console.error('Error minting NFT:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                'http://localhost:5000/api/test/submit',
                {
                    skill,
                    difficulty,
                    code
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

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
                    if (window.ethereum) {
                        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                        const userAddress = accounts[0];

                        const mintingFee = 0.05;
                        const valueInWei = window.web3.utils.toWei(mintingFee.toString(), 'ether');

                        const tokenURI = skill === 'Node.js'
                            ? 'https://res.cloudinary.com/du6vmyvdh/raw/upload/v1729623050/Blockchain/metadata-node-js_rar0xv.json'
                            : 'https://res.cloudinary.com/du6vmyvdh/raw/upload/v1729623050/Blockchain/metadata-react-js_cyz2kw.json';
                        console.log(ProofOfSkillABI);
                        console.log(contractAddress);
                        const contract = new window.web3.eth.Contract(ProofOfSkillABI, contractAddress);

                        // Estimate gas in frontend
                        const estimatedGas = await contract.methods.mintSkillNFT(userAddress, skill, 'Completed', tokenURI).estimateGas({ from: userAddress });

                        const mintResponse = await contract.methods.mintSkillNFT(userAddress, skill, 'Completed', tokenURI)
                            .send({ from: userAddress, value: valueInWei, gas: estimatedGas });

                        console.log('NFT Minted:', mintResponse);

                        await handleMintNFT(skill, 'Completed', tokenURI);
                        alert('NFT successfully minted for completing all difficulty levels of ' + skill + '!');
                    } else {
                        alert('Please install MetaMask to proceed with payment.');
                    }
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
