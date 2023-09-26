import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function Auth() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate for redirection

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleLogin = () => {
        // In a real application, perform actual authentication here
        // For demonstration, we'll use hardcoded credentials
        if (username === 'adil' && password === 'shehzad') {
            navigate('/admin'); // Redirect to the admin page on successful login
        } else {
            alert('Invalid credentials. Please try again.');
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">Login</h2>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        className="form-control"
                                        value={username}
                                        onChange={handleUsernameChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <div className="text-center">
                                    <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
