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
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {currentUser && (
                    <>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                        <li>
                            <Link to="/courses">Courses</Link>
                        </li>
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                )}
                {!currentUser && (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;