import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Contract, ethers, BrowserProvider } from 'ethers';
import Artifacts from './../contract/ProofOfSkill.json';
import './../styles/Dashboard.css';

const contractAddress = Artifacts.networks[5777].address;
const ProofOfSkillABI = Artifacts.abi;

const Dashboard = () => {
    const navigate = useNavigate();
    const [selectedSkill, setSelectedSkill] = useState('');
    const [selectedDifficultyReact, setSelectedDifficultyReact] = useState('');
    const [selectedDifficultyNode, setSelectedDifficultyNode] = useState('');
    const [completedTests, setCompletedTests] = useState([]);
    const [role, setRole] = useState('');

    useEffect(() => {
        const storedCompletedTests = JSON.parse(localStorage.getItem('completedTests')) || [];
        setCompletedTests(storedCompletedTests);

        const userRole = localStorage.getItem('role');
        setRole(userRole);
    }, []);

    const handleSkillChange = (e) => {
        setSelectedSkill(e.target.value);
        setSelectedDifficultyReact('');
        setSelectedDifficultyNode('');
    };

    const handleDifficultyChangeReact = (e) => {
        setSelectedDifficultyReact(e.target.value);
    };

    const handleDifficultyChangeNode = (e) => {
        setSelectedDifficultyNode(e.target.value);
    };

    const handleStartTest = () => {
        const selectedDifficulty = selectedSkill === 'React.js' ? selectedDifficultyReact : selectedDifficultyNode;

        if (selectedSkill && selectedDifficulty) {
            navigate(`/test?skill=${selectedSkill}&difficulty=${selectedDifficulty}`);
        } else {
            alert('Please select a skill and difficulty before starting the test.');
        }
    };

    const isTestCompleted = (skill, difficulty) => {
        return completedTests.some(test => test.skill === skill && test.difficulty === difficulty);
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('completedTests');
        navigate('/login');
    };

    const handleWithdraw = async () => {
        try {
            if (window.ethereum) {

                await window.ethereum.request({ method: 'eth_requestAccounts' });

                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractAddress, ProofOfSkillABI, signer);

                const balance = await provider.getBalance(contractAddress);
                console.log("Contract Balance:", ethers.formatEther(balance));

                if (balance === 0n) {
                    alert('Insufficient contract balance to withdraw.');
                    return;
                }

                const confirmWithdraw = window.confirm("Do you really want to withdraw?");
                if (!confirmWithdraw) return;


                const tx = await contract.withdraw({ gasLimit: "0x493E0" });
                await tx.wait();

                console.log('Withdrawal successful!');
                alert('Withdrawal successful!');
            } else {
                alert('MetaMask is not installed. Please install MetaMask to proceed.');
            }
        } catch (error) {
            console.error('Error during withdrawal:', error);

            if (error.code === 4001) {
                alert('Transaction rejected. Please try again.');
            } else {
                alert(`Withdrawal failed: ${error.message || 'Unknown error occurred'}`);
            }
        }
    };

    return (
        <div className="dashboard">
            <h2 className='heading'>Dashboard</h2>

            {role === "user" && (
                <>
                    <div className="skill-selection">
                        <h3 className='skills-heading'>Select Skill</h3>
                        <div className="tile-selection">
                            <div
                                className={`tile ${selectedSkill === "React.js" ? "selected" : ""}`}
                                onClick={() => handleSkillChange({ target: { value: "React.js" } })}
                            >
                                <div className="skill-text">React.js</div>

                                <div className="difficulty-selection">
                                    {["Easy", "Medium", "Hard"].map((difficulty) => (
                                        <div
                                            key={difficulty}
                                            className={`level-tile ${selectedDifficultyReact === difficulty ? "selected" : ""
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDifficultyChangeReact({ target: { value: difficulty } });
                                            }}
                                            style={{
                                                pointerEvents:
                                                    selectedSkill !== "React.js" ||
                                                        isTestCompleted("React.js", difficulty)
                                                        ? "none"
                                                        : "auto",
                                                opacity:
                                                    selectedSkill !== "React.js" ||
                                                        isTestCompleted("React.js", difficulty)
                                                        ? 0.5
                                                        : 1,
                                            }}
                                        >
                                            {difficulty}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div
                                className={`tile ${selectedSkill === "Node.js" ? "selected" : ""}`}
                                onClick={() => handleSkillChange({ target: { value: "Node.js" } })}
                            >
                                <div className="skill-text">Node.js</div>

                                <div className="difficulty-selection">
                                    {["Easy", "Medium", "Hard"].map((difficulty) => (
                                        <div
                                            key={difficulty}
                                            className={`level-tile ${selectedDifficultyNode === difficulty ? "selected" : ""
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDifficultyChangeNode({ target: { value: difficulty } });
                                            }}
                                            style={{
                                                pointerEvents:
                                                    selectedSkill !== "Node.js" ||
                                                        isTestCompleted("Node.js", difficulty)
                                                        ? "none"
                                                        : "auto",
                                                opacity:
                                                    selectedSkill !== "Node.js" ||
                                                        isTestCompleted("Node.js", difficulty)
                                                        ? 0.5
                                                        : 1,
                                            }}
                                        >
                                            {difficulty}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                    <button className="start-test-button" onClick={handleStartTest}>
                        Start Test
                    </button>



                </>
            )}

            {role === "owner" && (
                <div className="owner-options">
                    <h3 className='skills-heading'>Owner Dashboard</h3>
                    <button className="dashboard-button" onClick={handleWithdraw}>
                        Withdraw Funds
                    </button>
                </div>
            )}

            <div className="dashboard-options">
                <Link to="/profile" className="dashboard-button">
                    View Profile
                </Link>
                <button className="dashboard-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>

    );
};

export default Dashboard;
