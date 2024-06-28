import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CoursesPage from './pages/CoursesPage';
import ModulesPage from './pages/ModulesPage';
import QuizzesPage from './pages/QuizzesPage';
import ForumPage from './pages/ForumPage';
import ProgressPage from './pages/ProgressPage';
import CertificatePage from './pages/CertificatePage';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/modules" element={<ModulesPage />} />
                    <Route path="/quizzes" element={<QuizzesPage />} />
                    <Route path="/forum" element={<ForumPage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/certificates" element={<CertificatePage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;