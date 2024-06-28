import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const QuizzesPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newQuizTitle, setNewQuizTitle] = useState('');
    const [newQuestion, setNewQuestion] = useState({ text: '', options: ['', '', '', ''], correctOption: '' });
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [editingQuestions, setEditingQuestions] = useState([]);
    const [solvingQuiz, setSolvingQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

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

    const handleAddQuiz = useCallback(async () => {
        if (!newQuizTitle.trim()) {
            setError('Quiz title cannot be empty');
            return;
        }
        const questions = [
            { ...newQuestion, id: Date.now() }
        ];
        try {
            const response = await axios.post('/api/quizzes', { title: newQuizTitle, questions }, { headers: authService.authHeader() });
            setQuizzes([...quizzes, response.data]);
            setNewQuizTitle('');
            setNewQuestion({ text: '', options: ['', '', '', ''], correctOption: '' });
        } catch (error) {
            setError('Error adding quiz');
        }
    }, [newQuizTitle, newQuestion, quizzes]);

    const handleEditQuiz = useCallback(async () => {
        if (!editingTitle.trim()) {
            setError('Quiz title cannot be empty');
            return;
        }
        try {
            const response = await axios.put(`/api/quizzes/${editingQuiz.id}`, { title: editingTitle, questions: editingQuestions }, { headers: authService.authHeader() });
            const updatedQuizzes = quizzes.map((quiz) =>
                quiz.id === editingQuiz.id ? response.data : quiz
            );
            setQuizzes(updatedQuizzes);
            setEditingQuiz(null);
            setEditingTitle('');
            setEditingQuestions([]);
        } catch (error) {
            setError('Error editing quiz');
        }
    }, [editingQuiz, editingTitle, editingQuestions, quizzes]);

    const handleDeleteQuiz = useCallback(async (id) => {
        try {
            await axios.delete(`/api/quizzes/${id}`, { headers: authService.authHeader() });
            setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
        } catch (error) {
            setError('Error deleting quiz');
        }
    }, [quizzes]);

    const startEditing = useCallback((quiz) => {
        setEditingQuiz(quiz);
        setEditingTitle(quiz.title);
        setEditingQuestions(quiz.questions);
    }, []);

    const startSolving = useCallback((quiz) => {
        setSolvingQuiz(quiz);
        setAnswers({});
        setScore(null);
    }, []);

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...editingQuestions];
        updatedQuestions[index][field] = value;
        setEditingQuestions(updatedQuestions);
    };

    const addNewQuestion = () => {
        setEditingQuestions([...editingQuestions, { text: '', options: ['', '', '', ''], correctOption: '' }]);
    };

    const handleSubmitAnswers = async () => {
        let score = 0;
        solvingQuiz.questions.forEach((question, index) => {
            if (answers[index] === question.correctOption) {
                score += 1;
            }
        });
        setScore(score);

        try {
            await axios.post('/api/quiz-results', { quizId: solvingQuiz.id, score }, { headers: authService.authHeader() });
        } catch (error) {
            console.error('Error submitting quiz results', error);
        }
    };

    const currentUser = authService.getCurrentUser();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Quizzes</h1>
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz.id}>
                        {quiz.title}
                        {quiz.owner === currentUser?.username && (
                            <>
                                <button onClick={() => startEditing(quiz)}>Edit</button>
                                <button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
                            </>
                        )}
                        <button onClick={() => startSolving(quiz)}>Solve</button>
                    </li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    placeholder="New Quiz Title"
                />
                <button onClick={handleAddQuiz}>Add New Quiz</button>
                <div>
                    <h3>Questions</h3>
                    <input
                        type="text"
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                        placeholder="Question Text"
                    />
                    <div>
                        {newQuestion.options.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                        const updatedOptions = [...newQuestion.options];
                                        updatedOptions[index] = e.target.value;
                                        setNewQuestion({ ...newQuestion, options: updatedOptions });
                                    }}
                                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <label>Correct Option:</label>
                        <select
                            value={newQuestion.correctOption}
                            onChange={(e) => setNewQuestion({ ...newQuestion, correctOption: e.target.value })}
                        >
                            <option value="">Select Correct Option</option>
                            {newQuestion.options.map((option, index) => (
                                <option key={index} value={String.fromCharCode(65 + index)}>
                                    {String.fromCharCode(65 + index)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            {editingQuiz && (
                <div>
                    <h2>Edit Quiz</h2>
                    <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        placeholder="Edit Quiz Title"
                    />
                    <div>
                        <h3>Questions</h3>
                        {editingQuestions.map((question, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    value={question.text}
                                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                                    placeholder="Question Text"
                                />
                                <div>
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex}>
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => {
                                                    const updatedOptions = [...question.options];
                                                    updatedOptions[optionIndex] = e.target.value;
                                                    handleQuestionChange(index, 'options', updatedOptions);
                                                }}
                                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label>Correct Option:</label>
                                    <select
                                        value={question.correctOption}
                                        onChange={(e) => handleQuestionChange(index, 'correctOption', e.target.value)}
                                    >
                                        <option value="">Select Correct Option</option>
                                        {question.options.map((option, optionIndex) => (
                                            <option key={optionIndex} value={String.fromCharCode(65 + optionIndex)}>
                                                {String.fromCharCode(65 + optionIndex)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                        <button onClick={addNewQuestion}>Add Question</button>
                    </div>
                    <button onClick={handleEditQuiz}>Save</button>
                    <button onClick={() => setEditingQuiz(null)}>Cancel</button>
                </div>
            )}
            {solvingQuiz && (
                <div>
                    <h2>Solve Quiz: {solvingQuiz.title}</h2>
                    <div>
                        {solvingQuiz.questions.map((question, index) => (
                            <div key={index}>
                                <p>{question.text}</p>
                                <div>
                                    {question.options.map((option, optionIndex) => (
                                        <label key={optionIndex}>
                                            <input
                                                type="radio"
                                                name={`question-${index}`}
                                                value={String.fromCharCode(65 + optionIndex)}
                                                onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSubmitAnswers}>Submit Answers</button>
                    {score !== null && (
                        <p>Your score: {score}/{solvingQuiz.questions.length}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizzesPage;