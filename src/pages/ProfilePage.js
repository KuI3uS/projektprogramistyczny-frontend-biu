import React, { useState } from 'react';
import authService from '../services/authService';
import apiService from '../services/apiService';

const ProfilePage = () => {
    const currentUser = authService.getCurrentUser();
    const [username, setUsername] = useState(currentUser ? currentUser.username : '');
    const [email, setEmail] = useState(currentUser ? currentUser.email : '');
    const [profilePicture, setProfilePicture] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }
        if (newPassword) {
            formData.append('newPassword', newPassword);
        }

        try {
            await apiService.updateUser(currentUser.username, formData);
            setMessage('Profile updated successfully');
            authService.logout();
            window.location.href = '/login';
        } catch (error) {
            console.error('Error updating profile', error);
            setMessage('Error updating profile');
        }
    };

    return (
        <div>
            <h1>Profile Page</h1>
            <form onSubmit={handleProfileUpdate}>
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
                        type="email"
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
                <button type="submit">Update Profile</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ProfilePage;