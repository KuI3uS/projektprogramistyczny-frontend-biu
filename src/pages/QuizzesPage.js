import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const QuizzesPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('/api/quizzes', { headers: authService.authHeader() });
                setQuizzes(response.data);
            } catch (error) {
                setError('Error fetching quizzes');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Quizzes</h1>
            <ul>
                {quizzes.map(quiz => (
                    <li key={quiz.id}>{quiz.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default QuizzesPage;