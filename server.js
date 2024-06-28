const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5001;
const secretKey = 'your-secret-key';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send();
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(403).send({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ username: user.username }, secretKey);
    res.json({ accessToken });
});

app.get('/api/courses', authenticateToken, (req, res) => {
    res.status(200).json(courses);
});

app.post('/api/courses', authenticateToken, (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    const newCourse = { id: courses.length + 1, title, owner: req.user.username };
    courses.push(newCourse);
    res.status(201).json(newCourse);
});

app.put('/api/courses/:id', authenticateToken, (req, res) => {
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

app.delete('/api/courses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const courseIndex = courses.findIndex((c) => c.id === parseInt(id));
    if (courseIndex !== -1 && courses[courseIndex].owner === req.user.username) {
        courses.splice(courseIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Course not found or not authorized' });
    }
});

app.get('/api/modules', authenticateToken, (req, res) => {
    res.status(200).json(modules);
});

app.post('/api/modules', authenticateToken, (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    const newModule = { id: modules.length + 1, title, owner: req.user.username };
    modules.push(newModule);
    res.status(201).json(newModule);
});

app.put('/api/modules/:id', authenticateToken, (req, res) => {
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

app.delete('/api/modules/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const moduleIndex = modules.findIndex((m) => m.id === parseInt(id));
    if (moduleIndex !== -1 && modules[moduleIndex].owner === req.user.username) {
        modules.splice(moduleIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Module not found or not authorized' });
    }
});

app.get('/api/quizzes', authenticateToken, (req, res) => {
    res.status(200).json(quizzes);
});

app.post('/api/quizzes', authenticateToken, (req, res) => {
    const { title, questions } = req.body;
    if (!title || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ message: 'Title and questions are required' });
    }
    const newQuiz = { id: quizzes.length + 1, title, questions, owner: req.user.username };
    quizzes.push(newQuiz);
    res.status(201).json(newQuiz);
});

app.put('/api/quizzes/:id', authenticateToken, (req, res) => {
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

app.delete('/api/quizzes/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const quizIndex = quizzes.findIndex((q) => q.id === parseInt(id));
    if (quizIndex !== -1 && quizzes[quizIndex].owner === req.user.username) {
        quizzes.splice(quizIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Quiz not found or not authorized' });
    }
});

app.put('/api/profile', authenticateToken, upload.single('profilePicture'), (req, res) => {
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
app.put('/api/users/:username', authenticateToken, async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});