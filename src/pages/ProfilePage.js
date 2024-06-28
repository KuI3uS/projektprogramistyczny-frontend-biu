import React, { useState } from 'react';
import authService from '../services/authService';

const ProfilePage = () => {
    const currentUser = authService.getCurrentUser();
    const [username, setUsername] = useState(currentUser.username);
    const [email, setEmail] = useState(currentUser.email || '');
    const [profilePicture, setProfilePicture] = useState(null);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        // Logika aktualizacji profilu
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
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
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default ProfilePage;