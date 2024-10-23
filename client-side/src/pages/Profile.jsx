import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../styles/Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [completedTests, setCompletedTests] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            } else {
                try {
                    const response = await axios.get('http://localhost:5000/api/auth/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                    const storedCompletedTests = JSON.parse(localStorage.getItem('completedTests')) || [];
                    setCompletedTests(storedCompletedTests);
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    navigate('/login');
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('completedTests');
        navigate('/login');
    };
    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile">
            <h2>Profile Page</h2>
            <div className="card">
                <svg
                    className="img"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                    width="100%"
                    height="100%"
                    version="1.1"
                    shapeRendering="geometricPrecision"
                    textRendering="geometricPrecision"
                    imageRendering="optimizeQuality"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    viewBox="0 0 784.37 1277.39"
                >
                    <g id="Layer_x0020_1">
                        <g id="_1421394342400">
                            <g>
                                <polygon
                                    fill="#343434"
                                    fillRule="nonzero"
                                    points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"
                                />
                                <polygon
                                    fill="#8C8C8C"
                                    fillRule="nonzero"
                                    points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"
                                />
                                <polygon
                                    fill="#3C3C3B"
                                    fillRule="nonzero"
                                    points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"
                                />
                                <polygon
                                    fill="#8C8C8C"
                                    fillRule="nonzero"
                                    points="392.07,1277.38 392.07,956.52 -0,724.89"
                                />
                                <polygon
                                    fill="#141414"
                                    fillRule="nonzero"
                                    points="392.07,882.29 784.13,650.54 392.07,472.33"
                                />
                                <polygon
                                    fill="#393939"
                                    fillRule="nonzero"
                                    points="0,650.54 392.07,882.29 392.07,472.33"
                                />
                            </g>
                        </g>
                    </g>
                </svg>
                <div className="textBox">
                    <p className="text head">{user.user}</p>
                    <span>{user.role === "owner" ? user.role : user.email}</span>

                    <div className="completed-tests">
                        {user.role !== "owner" && (
                            <>
                                <h3>Completed Tests</h3>
                                {completedTests.length > 0 ? (
                                    <ul>
                                        {completedTests.map((test, index) => (
                                            <li key={index}>
                                                {test.skill} - {test.difficulty}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No tests completed yet.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>;
            </div>;
            <div className='btn-section'>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>

        </div>
    );
};

export default Profile;
