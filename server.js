const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 5001;
const secretKey = 'your-secret-key';

app.use(cors());
app.use(express.json());

const users = [];
let courses = [
    { id: 1, title: 'Course 1', owner: 'user1' },
    { id: 2, title: 'Course 2', owner: 'user2' },
];

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});