import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home">
            <div className='home-panel'>
                <p className='team-name'>Dark Devs</p>
                <p className='project-name'>Decentralized Proof-of-Skill Portfolio</p>
            </div>
            <div className='home-button-panel'>
                <button
                    className="sign-in-button"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
                <br />
                <button
                    className="sign-up-button"
                    onClick={() => navigate('/register')}
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Home;
