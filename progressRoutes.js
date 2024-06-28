const express = require('express');
const router = express.Router();

let userProgress = [];

module.exports = (authenticateToken) => {
    router.get('/progress', authenticateToken, (req, res) => {
        const progress = userProgress.filter(p => p.username === req.user.username);
        res.status(200).json(progress);
    });

    router.post('/progress', authenticateToken, (req, res) => {
        const { courseId, moduleId, progress } = req.body;
        if (!courseId || !moduleId || progress === undefined) {
            return res.status(400).json({ message: 'Course ID, Module ID, and progress are required' });
        }
        userProgress.push({ username: req.user.username, courseId, moduleId, progress });
        res.status(201).json({ message: 'Progress saved successfully' });
    });

    return router;
};