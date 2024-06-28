import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
    const currentUser = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        window.location.href = '/login';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">E-Learning</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {currentUser && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/courses">Courses</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/modules">Modules</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/quizzes">Quizzes</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/forum">Forum</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/progress">Progress</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/Certificates">Certificates</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                        {!currentUser && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;