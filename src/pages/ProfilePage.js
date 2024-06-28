import React, { useState } from 'react';
import authService from '../services/authService';
import axios from 'axios';

const ProfilePage = () => {
    const currentUser = authService.getCurrentUser();
    const [username, setUsername] = useState(currentUser?.username || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [profilePicture, setProfilePicture] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleUpdateProfile = async () => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }
        try {
            const response = await axios.put('/api/profile', formData, {
                headers: {
                    ...authService.authHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Profile updated successfully');
            authService.logout();
            window.location.href = '/login';
        } catch (error) {
            setMessage('Error updating profile');
        }
    };

    const handleUpdateUser = async () => {
        try {
            const response = await axios.put(`/api/users/${currentUser.username}`, {
                newUsername: username,
                newPassword: newPassword,
            }, {
                headers: authService.authHeader(),
            });
            setMessage('User updated successfully');
            authService.logout();
            window.location.href = '/login';
        } catch (error) {
            setMessage('Error updating user');
        }
    };

    return (
        <div>
            <h1>Profile Page</h1>
            {message && <p>{message}</p>}
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Profile Picture:</label>
                <input
                    type="file"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                />
            </div>
            <div>
                <label>New Password:</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <button onClick={handleUpdateProfile}>Update Profile</button>
            <button onClick={handleUpdateUser}>Update User</button>
        </div>
    );
};

export default ProfilePage;