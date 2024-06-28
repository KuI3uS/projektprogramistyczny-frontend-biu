
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const ProgressPage = () => {
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await axios.get('/api/progress', { headers: authService.authHeader() });
                setProgress(response.data);
            } catch (error) {
                setError('Error fetching progress');
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Progress</h1>
            <ul>
                {progress.map((entry, index) => (
                    <li key={index}>
                        Quiz ID: {entry.quizId}, Score: {entry.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProgressPage;