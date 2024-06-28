import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const QuizzesPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newQuiz, setNewQuiz] = useState('');
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctOption: '' }]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('/api/quizzes', { headers: authService.authHeader() });
                setQuizzes(response.data);
            } catch (error) {
                setError('Error fetching quizzes');
                console.error('Error fetching quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const handleAddQuiz = async () => {
        if (!newQuiz.trim() || questions.some(q => !q.text || q.options.some(opt => !opt))) {
            setError('Quiz title and all questions must be filled');
            return;
        }
        try {
            const response = await axios.post('/api/quizzes', { title: newQuiz, questions }, { headers: authService.authHeader() });
            setQuizzes([...quizzes, response.data]);
            setNewQuiz('');
            setQuestions([{ text: '', options: ['', '', '', ''], correctOption: '' }]);
        } catch (error) {
            setError('Error adding quiz');
            console.error('Error adding quiz:', error);
        }
    };

    const handleEditQuiz = async () => {
        if (!editingTitle.trim() || questions.some(q => !q.text || q.options.some(opt => !opt))) {
            setError('Quiz title and all questions must be filled');
            return;
        }
        try {
            const response = await axios.put(`/api/quizzes/${editingQuiz.id}`, { title: editingTitle, questions }, { headers: authService.authHeader() });
            const updatedQuizzes = quizzes.map((quiz) =>
                quiz.id === editingQuiz.id ? response.data : quiz
            );
            setQuizzes(updatedQuizzes);
            setEditingQuiz(null);
            setEditingTitle('');
            setQuestions([{ text: '', options: ['', '', '', ''], correctOption: '' }]);
        } catch (error) {
            setError('Error editing quiz');
            console.error('Error editing quiz:', error);
        }
    };

    const handleDeleteQuiz = async (id) => {
        try {
            await axios.delete(`/api/quizzes/${id}`, { headers: authService.authHeader() });
            setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
        } catch (error) {
            setError('Error deleting quiz');
            console.error('Error deleting quiz:', error);
        }
    };

    const startEditing = (quiz) => {
        setEditingQuiz(quiz);
        setEditingTitle(quiz.title);
        setQuestions(quiz.questions);
    };

    const cancelEditing = () => {
        setEditingQuiz(null);
        setEditingTitle('');
        setQuestions([{ text: '', options: ['', '', '', ''], correctOption: '' }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[optIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', '', '', ''], correctOption: '' }]);
    };

    const removeQuestion = (index) => {
        const updatedQuestions = questions.filter((q, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h1>Quizzes</h1>
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz.id}>
                        {quiz.title}
                        <button onClick={() => startEditing(quiz)}>Edit</button>
                        <button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    value={newQuiz}
                    onChange={(e) => setNewQuiz(e.target.value)}
                    placeholder="New Quiz"
                />
                <button onClick={handleAddQuiz}>Add New Quiz</button>
            </div>
            {editingQuiz && (
                <div>
                    <h2>Edit Quiz</h2>
                    <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        placeholder="Quiz Title"
                    />
                    <h3>Questions</h3>
                    {questions.map((question, qIndex) => (
                        <div key={qIndex}>
                            <input
                                type="text"
                                value={question.text}
                                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                placeholder="Question Text"
                            />
                            <div>
                                {question.options.map((option, optIndex) => (
                                    <input
                                        key={optIndex}
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                    />
                                ))}
                            </div>
                            <select
                                value={question.correctOption}
                                onChange={(e) => handleQuestionChange(qIndex, 'correctOption', e.target.value)}
                            >
                                <option value="">Select Correct Option</option>
                                {question.options.map((option, optIndex) => (
                                    <option key={optIndex} value={String.fromCharCode(65 + optIndex)}>
                                        {String.fromCharCode(65 + optIndex)}
                                    </option>
                                ))}
                            </select>
                            <button onClick={() => removeQuestion(qIndex)}>Remove Question</button>
                        </div>
                    ))}
                    <button onClick={addQuestion}>Add Question</button>
                    <button onClick={handleEditQuiz}>Save Quiz</button>
                    <button onClick={cancelEditing}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default QuizzesPage;