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
                console.error('Error fetching progress:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h1>Progress</h1>
            {progress.map((entry) => (
                <div key={`${entry.courseId}-${entry.moduleId}`} className="card">
                    <h3>Course: {entry.courseId}</h3>
                    <p>Module: {entry.moduleId}</p>
                    <p>Progress: {entry.progress}%</p>
                </div>
            ))}
        </div>
    );
};

export default ProgressPage;