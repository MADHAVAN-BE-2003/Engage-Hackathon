import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './../styles/Register.css';

const Register = () => {
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                user,
                email,
                password,
            });

            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError('User already exists or invalid registration details.');
            } else {
                setError('Server error. Please try again later.');
            }
        }
    };

    return (
        <div className="register-page">
            <div className="register">

                <form onSubmit={handleSubmit}>
                    <h3>Register</h3>
                    <input
                        type="text"
                        placeholder="Username"
                        value={user}
                        className='input-box'
                        onChange={(e) => setUser(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        className='input-box'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        className='input-box'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Register</button>
                    <div className="register-link">
                        <p>Already I have an account? <Link to="/login">Login</Link></p>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Register;
