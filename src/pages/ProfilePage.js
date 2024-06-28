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
        <div className="container mt-5">
            <h1 className="display-4">Profile Page</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                    <label className="form-label">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Profile Picture:</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">New Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
        </div>
    );
};

export default ProfilePage;