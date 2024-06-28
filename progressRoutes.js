const express = require('express');
const router = express.Router();

let userProgress = [];

module.exports = (authenticateToken) => {
    router.get('/progress', authenticateToken, (req, res) => {
        const progress = userProgress.filter(p => p.username === req.user.username);
        res.status(200).json(progress);
    });

    router.post('/progress', authenticateToken, (req, res) => {
        const { quizId, score } = req.body;
        if (!quizId || score === undefined) {
            return res.status(400).json({ message: 'Quiz ID and score are required' });
        }
        userProgress.push({ username: req.user.username, quizId, score });
        res.status(201).json({ message: 'Progress saved successfully' });
    });

    return router;
};