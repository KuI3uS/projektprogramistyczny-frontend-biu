import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const QuizzesPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [newQuizTitle, setNewQuizTitle] = useState('');
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionOptions, setNewQuestionOptions] = useState({ A: '', B: '', C: '', D: '' });
    const [newQuestionCorrectOption, setNewQuestionCorrectOption] = useState('');
    const [editingQuiz, setEditingQuiz] = useState(null);

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

    const handleAddQuiz = async () => {
        if (!newQuizTitle.trim()) {
            setError('Quiz title cannot be empty');
            return;
        }
        try {
            const response = await axios.post('/api/quizzes', { title: newQuizTitle, questions: [] }, { headers: authService.authHeader() });
            setQuizzes([...quizzes, response.data]);
            setNewQuizTitle('');
        } catch (error) {
            setError('Error adding quiz');
        }
    };

    const handleAddQuestion = async (quizId) => {
        if (!newQuestionText.trim() || !newQuestionCorrectOption.trim()) {
            setError('Question text and correct option cannot be empty');
            return;
        }
        try {
            const quiz = quizzes.find(q => q.id === quizId);
            const newQuestion = {
                id: quiz.questions.length + 1,
                text: newQuestionText,
                options: Object.values(newQuestionOptions),
                correctOption: newQuestionCorrectOption
            };
            const updatedQuiz = { ...quiz, questions: [...quiz.questions, newQuestion] };
            await axios.put(`/api/quizzes/${quizId}`, updatedQuiz, { headers: authService.authHeader() });
            setQuizzes(quizzes.map(q => q.id === quizId ? updatedQuiz : q));
            setNewQuestionText('');
            setNewQuestionOptions({ A: '', B: '', C: '', D: '' });
            setNewQuestionCorrectOption('');
        } catch (error) {
            setError('Error adding question');
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        try {
            await axios.delete(`/api/quizzes/${quizId}`, { headers: authService.authHeader() });
            setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
        } catch (error) {
            setError('Error deleting quiz');
        }
    };

    const startEditing = (quiz) => {
        setEditingQuiz(quiz);
        setNewQuizTitle(quiz.title);
    };

    const handleEditQuiz = async () => {
        if (!newQuizTitle.trim()) {
            setError('Quiz title cannot be empty');
            return;
        }
        try {
            const updatedQuiz = { ...editingQuiz, title: newQuizTitle };
            await axios.put(`/api/quizzes/${editingQuiz.id}`, updatedQuiz, { headers: authService.authHeader() });
            setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? updatedQuiz : q));
            setEditingQuiz(null);
            setNewQuizTitle('');
        } catch (error) {
            setError('Error editing quiz');
        }
    };

    const cancelEditing = () => {
        setEditingQuiz(null);
        setNewQuizTitle('');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Quizzes</h1>
            <div>
                <input
                    type="text"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    placeholder="New Quiz Title"
                />
                <button onClick={handleAddQuiz}>Add Quiz</button>
            </div>
            {quizzes.map((quiz) => (
                <div key={quiz.id}>
                    <h3>{quiz.title}</h3>
                    {editingQuiz && editingQuiz.id === quiz.id ? (
                        <div>
                            <input
                                type="text"
                                value={newQuizTitle}
                                onChange={(e) => setNewQuizTitle(e.target.value)}
                                placeholder="Edit Quiz Title"
                            />
                            <button onClick={handleEditQuiz}>Save</button>
                            <button onClick={cancelEditing}>Cancel</button>
                        </div>
                    ) : (
                        <>
                            <button onClick={() => startEditing(quiz)}>Edit</button>
                            <button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
                        </>
                    )}
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
                    <div>
                        <input
                            type="text"
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                            placeholder="New Question Text"
                        />
                        <div>
                            {Object.keys(newQuestionOptions).map(option => (
                                <input
                                    key={option}
                                    type="text"
                                    value={newQuestionOptions[option]}
                                    onChange={(e) => setNewQuestionOptions({ ...newQuestionOptions, [option]: e.target.value })}
                                    placeholder={`Option ${option}`}
                                />
                            ))}
                        </div>
                        <input
                            type="text"
                            value={newQuestionCorrectOption}
                            onChange={(e) => setNewQuestionCorrectOption(e.target.value)}
                            placeholder="Correct Option"
                        />
                        <button onClick={() => handleAddQuestion(quiz.id)}>Add Question</button>
                    </div>
                </div>
            ))}
            <button onClick={handleSubmit}>Submit Answers</button>
        </div>
    );
};

export default QuizzesPage;