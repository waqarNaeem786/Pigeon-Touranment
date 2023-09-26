import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Adminpanel from './Adminpanel';
import MainPage from './Mainpage';

function App() {
    return (
        <Router>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">Main</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ml-auto"> {/* Align the links to the right */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/Login">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <Routes>
                    <Route exact path="/" element={<MainPage />} />
                    <Route path="/Login" element={<Auth />} />
                    <Route
                        path="/admin"
                        element={
                            <RequireAuth>
                                <Adminpanel />
                            </RequireAuth>
                        }
                    />
                    {/* Catch-all route for unknown paths */}
                    <Route path="*" element={<Navigate to="/main" />} />
                </Routes>
            </div>
        </Router>
    );
}

// Higher-order component for requiring authentication
function RequireAuth({ children }) {
    // Implement your authentication logic here
    // For example, check if the user is an admin
    const isAdmin = true; // Replace with your authentication logic

    if (!isAdmin) {
        // If not an admin, redirect to the login page
        return <Navigate to="/Login" />;
    }

    return children;
}

export default App;
