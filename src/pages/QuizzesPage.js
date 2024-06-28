import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const QuizzesPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showResults, setShowResults] = useState(false);

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

    const handleOptionChange = (quizId, questionId, option) => {
        setSelectedOptions({
            ...selectedOptions,
            [quizId]: {
                ...selectedOptions[quizId],
                [questionId]: option
            }
        });
    };

    const handleSubmit = () => {
        setShowResults(true);
    };

    const getResult = (quiz, questionId, option) => {
        const question = quiz.questions.find(q => q.id === questionId);
        return question.correctOption === option ? ' (correct answer)' : ' (incorrect answer)';
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Quizzes</h1>
            {quizzes.map((quiz) => (
                <div key={quiz.id}>
                    <h3>{quiz.title}</h3>
                    {quiz.questions.map((question) => (
                        <div key={question.id}>
                            <p>{question.text}</p>
                            {question.options.map((option) => (
                                <label key={option}>
                                    <input
                                        type="radio"
                                        value={option}
                                        checked={selectedOptions[quiz.id]?.[question.id] === option}
                                        onChange={() => handleOptionChange(quiz.id, question.id, option)}
                                    />
                                    {option}
                                    {showResults && getResult(quiz, question.id, option)}
                                </label>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit Answers</button>
        </div>
    );
};

export default QuizzesPage;