const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

let userProgress = [];

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

// Endpoint to submit quiz results
app.put('/api/profile', authenticateToken, upload.single('profilePicture'), async (req, res) => {
    const { username, email, newPassword } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (user) {
        user.username = username || user.username;
        user.email = email || user.email;
        if (req.file) {
            user.profilePicture = req.file.path;
        }
        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
            return res.status(200).json({ message: 'Profile updated successfully, please log in again', logout: true });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
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

// Import the progress router and forum router
const progressRouter = require('./progressRoutes')(authenticateToken);
const forumRouter = require('./forumRoutes')(authenticateToken);

// Use the progress router and forum router
app.use('/api', progressRouter);
app.use('/api', forumRouter);
const certificatesDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir);
}

// Endpoint to generate certificates
app.post('/api/certificates', authenticateToken, (req, res) => {
    const { courseId } = req.body;
    const course = courses.find(c => c.id === courseId);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    const certificateContent = `
        Certificate of Completion
        This is to certify that ${req.user.username} has successfully completed the course ${course.title}.
    `;

    const filePath = path.join(certificatesDir, `${req.user.username}-${course.title}.txt`);
    fs.writeFile(filePath, certificateContent, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error generating certificate' });
        }

        res.download(filePath, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error downloading certificate' });
            }

            // Remove the certificate file after download
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting certificate file:', err);
                }
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});