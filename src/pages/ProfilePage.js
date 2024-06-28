import React from 'react';
import authService from '../services/authService';

const ProfilePage = () => {
    const currentUser = authService.getCurrentUser();

    return (
        <div>
            <h1>Profile Page</h1>
            <p>Welcome, {currentUser ? currentUser.username : 'Guest'}!</p>
        </div>
    );
};

export default ProfilePage;