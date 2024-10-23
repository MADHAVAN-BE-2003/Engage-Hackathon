import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            if (response.data.token) {
                console.log(response.data);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('completedTests', JSON.stringify(response.data.completedTests));

                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };


    return (
        <div className="login-page">
            <div className="login">

                <form onSubmit={handleSubmit}>
                    <h3>Login</h3>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            className='input-box'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            className='input-box'
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Login</button>
                    <div className="login-link">
                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default Login;
