const express = require('express');
const router = express.Router();

let forumPosts = [];

module.exports = (authenticateToken) => {
    router.get('/forum', authenticateToken, (req, res) => {
        res.status(200).json(forumPosts);
    });

    router.post('/forum', authenticateToken, (req, res) => {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        const newPost = { id: forumPosts.length + 1, content, owner: req.user.username };
        forumPosts.push(newPost);
        res.status(201).json(newPost);
    });

    return router;
};