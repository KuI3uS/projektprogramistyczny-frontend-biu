const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const secretKey = 'your-secret-key';

const users = [];
let courses = [
    { id: 1, title: 'Course 1', owner: 'user1' },
    { id: 2, title: 'Course 2', owner: 'user2' },
];
let modules = [
    { id: 1, title: 'Module 1', owner: 'user1' },
    { id: 2, title: 'Module 2', owner: 'user2' },
];
let quizzes = [
    {
        id: 1,
        title: 'Quiz 1',
        questions: [
            { id: 1, text: 'What is the capital of France?', options: ['A', 'B', 'C', 'D'], correctOption: 'A' },
            { id: 2, text: 'What is 2 + 2?', options: ['A', 'B', 'C', 'D'], correctOption: 'B' }
        ],
        owner: 'user1'
    },
    {
        id: 2,
        title: 'Quiz 2',
        questions: [
            { id: 1, text: 'What is the capital of Germany?', options: ['A', 'B', 'C', 'D'], correctOption: 'C' },
            { id: 2, text: 'What is 3 + 3?', options: ['A', 'B', 'C', 'D'], correctOption: 'D' }
        ],
        owner: 'user2'
    },
];
const ratingsFilePath = path.join(__dirname, 'courseRatings.json');

const readRatingsFromFile = () => {
    if (fs.existsSync(ratingsFilePath)) {
        const data = fs.readFileSync(ratingsFilePath);
        return JSON.parse(data);
    }
    return [];
};

const writeRatingsToFile = (ratings) => {
    fs.writeFileSync(ratingsFilePath, JSON.stringify(ratings, null, 2));
};

module.exports = (authenticateToken, upload) => {
    router.post('/register', async (req, res) => {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });
        res.status(201).send();
    });

    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const user = users.find((u) => u.username === username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(403).send({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ username: user.username }, secretKey);
        res.json({ accessToken });
    });

    router.get('/courses', authenticateToken, (req, res) => {
        res.status(200).json(courses);
    });

    router.post('/courses', authenticateToken, (req, res) => {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const newCourse = { id: courses.length + 1, title, owner: req.user.username };
        courses.push(newCourse);
        res.status(201).json(newCourse);
    });

    router.put('/courses/:id', authenticateToken, (req, res) => {
        const { id } = req.params;
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const course = courses.find((c) => c.id === parseInt(id));
        if (course && course.owner === req.user.username) {
            course.title = title;
            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Course not found or not authorized' });
        }
    });

    router.delete('/courses/:id', authenticateToken, (req, res) => {
        const { id } = req.params;
        const courseIndex = courses.findIndex((c) => c.id === parseInt(id));
        if (courseIndex !== -1 && courses[courseIndex].owner === req.user.username) {
            courses.splice(courseIndex, 1);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Course not found or not authorized' });
        }
    });

    router.post('/courses/:id/rate', authenticateToken, (req, res) => {
        const { id } = req.params;
        const { rating } = req.body;
        const course = courses.find(c => c.id === parseInt(id));
        if (course) {
            let ratings = readRatingsFromFile();
            const existingRating = ratings.find(r => r.courseId === course.id && r.user === req.user.username);
            if (existingRating) {
                existingRating.rating = rating;
            } else {
                ratings.push({ courseId: course.id, user: req.user.username, rating });
            }
            writeRatingsToFile(ratings);
            res.status(200).json({ message: 'Rating submitted successfully' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    });

    // Endpoint to get the average rating of a course
    router.get('/courses/:id/rating', authenticateToken, (req, res) => {
        const { id } = req.params;
        const ratings = readRatingsFromFile();
        const courseRatings = ratings.filter(r => r.courseId === parseInt(id));
        if (courseRatings.length > 0) {
            const averageRating = courseRatings.reduce((sum, r) => sum + r.rating, 0) / courseRatings.length;
            res.status(200).json({ averageRating });
        } else {
            res.status(404).json({ message: 'No ratings found for this course' });
        }
    });

    router.get('/modules', authenticateToken, (req, res) => {
        res.status(200).json(modules);
    });

    router.post('/modules', authenticateToken, (req, res) => {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const newModule = { id: modules.length + 1, title, owner: req.user.username };
        modules.push(newModule);
        res.status(201).json(newModule);
    });

    router.put('/modules/:id', authenticateToken, (req, res) => {
        const { id } = req.params;
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const module = modules.find((m) => m.id === parseInt(id));
        if (module && module.owner === req.user.username) {
            module.title = title;
            res.status(200).json(module);
        } else {
            res.status(404).json({ message: 'Module not found or not authorized' });
        }
    });

    router.delete('/modules/:id', authenticateToken, (req, res) => {
        const { id } = req.params;
        const moduleIndex = modules.findIndex((m) => m.id === parseInt(id));
        if (moduleIndex !== -1 && modules[moduleIndex].owner === req.user.username) {
            modules.splice(moduleIndex, 1);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Module not found or not authorized' });
        }
    });

    router.get('/quizzes', authenticateToken, (req, res) => {
        res.status(200).json(quizzes);
    });
    router.post('/quizzes', authenticateToken, (req, res) => {
        const { title, questions } = req.body;
        if (!title || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Title and questions are required' });
        }
        const newQuiz = { id: quizzes.length + 1, title, questions, owner: req.user.username };
        quizzes.push(newQuiz);
        res.status(201).json(newQuiz);
    });

    router.put('/quizzes/:id', authenticateToken, (req, res) => {
        const { id } = req.params;
        const { title, questions } = req.body;
        if (!title || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Title and questions are required' });
        }
        const quiz = quizzes.find((q) => q.id === parseInt(id));
        if (quiz && quiz.owner === req.user.username) {
            quiz.title = title;
            quiz.questions = questions;
            res.status(200).json(quiz);
        } else {
            res.status(404).json({ message: 'Quiz not found or not authorized' });
        }
    });

    router.delete('/quizzes/:id', authenticateToken, (req, res) => {
        const { id } = req.params;
        const quizIndex = quizzes.findIndex((q) => q.id === parseInt(id));
        if (quizIndex !== -1 && quizzes[quizIndex].owner === req.user.username) {
            quizzes.splice(quizIndex, 1);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Quiz not found or not authorized' });
        }
    });

    router.put('/profile', authenticateToken, upload.single('profilePicture'), (req, res) => {
        const { username, email } = req.body;
        const user = users.find(u => u.username === req.user.username);
        if (user) {
            user.username = username || user.username;
            user.email = email || user.email;
            if (req.file) {
                user.profilePicture = req.file.path;
            }
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });

    router.put('/users/:username', authenticateToken, async (req, res) => {
        const { username } = req.params;
        const { newUsername, newPassword } = req.body;
        const user = users.find(u => u.username === username);
        if (user) {
            user.username = newUsername || user.username;
            if (newPassword) {
                user.password = await bcrypt.hash(newPassword, 10);
            }
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });

    return router;
};

const express = require('express');
const router = express.Router();

let forums = [
    {
        id: 1,
        title: 'General Discussion',
        posts: [
            { id: 1, user: 'user1', content: 'Welcome to the forum!' },
            { id: 2, user: 'user2', content: 'Hello everyone!' }
        ],
    },
];

module.exports = (authenticateToken) => {
    router.get('/forums', authenticateToken, (req, res) => {
        res.status(200).json(forums);
    });

    router.post('/forums', authenticateToken, (req, res) => {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const newForum = { id: forums.length + 1, title, posts: [] };
        forums.push(newForum);
        res.status(201).json(newForum);
    });

    router.post('/forums/:id/posts', authenticateToken, (req, res) => {
        const { id } = req.params;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        const forum = forums.find(f => f.id === parseInt(id));
        if (forum) {
            const newPost = { id: forum.posts.length + 1, user: req.user.username, content };
            forum.posts.push(newPost);
            res.status(201).json(newPost);
        } else {
            res.status(404).json({ message: 'Forum not found' });
        }
    });

    return router;
};

