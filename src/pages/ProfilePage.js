import React, { useState } from 'react';
import authService from '../services/authService';

const ProfilePage = () => {
    const currentUser = authService.getCurrentUser();
    const [username, setUsername] = useState(currentUser ? currentUser.username : '');
    const [email, setEmail] = useState(currentUser ? currentUser.email : '');
    const [newPassword, setNewPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('newPassword', newPassword);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const response = await authService.updateProfile(formData);
            setSuccess(response.data.message);
            if (response.data.logout) {
                authService.logout();
                window.location.href = '/login';
            }
        } catch (error) {
            setError('Error updating profile');
        }
    };

    return (
        <div>
            <h1>Profile Page</h1>
            <form onSubmit={handleUpdateProfile}>
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
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </div>
    );
};

export default ProfilePage;