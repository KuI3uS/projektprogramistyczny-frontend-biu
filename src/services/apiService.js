import axios from 'axios';
import authService from './authService';

const API_URL = '/api/';

const getCourses = () => {
    return axios.get(API_URL + 'courses', { headers: authService.authHeader() });
};

const createCourse = (title) => {
    return axios.post(API_URL + 'courses', { title }, { headers: authService.authHeader() });
};

const updateCourse = (id, title) => {
    return axios.put(API_URL + `courses/${id}`, { title }, { headers: authService.authHeader() });
};

const deleteCourse = (id) => {
    return axios.delete(API_URL + `courses/${id}`, { headers: authService.authHeader() });
};

const rateCourse = (id, rating) => {
    return axios.post(API_URL + `courses/${id}/rate`, { rating }, { headers: authService.authHeader() });
};

const getModules = () => {
    return axios.get(API_URL + 'modules', { headers: authService.authHeader() });
};

const createModule = (title) => {
    return axios.post(API_URL + 'modules', { title }, { headers: authService.authHeader() });
};

const updateModule = (id, title) => {
    return axios.put(API_URL + `modules/${id}`, { title }, { headers: authService.authHeader() });
};

const deleteModule = (id) => {
    return axios.delete(API_URL + `modules/${id}`, { headers: authService.authHeader() });
};

const getQuizzes = () => {
    return axios.get(API_URL + 'quizzes', { headers: authService.authHeader() });
};

const createQuiz = (title, questions) => {
    return axios.post(API_URL + 'quizzes', { title, questions }, { headers: authService.authHeader() });
};

const updateQuiz = (id, title, questions) => {
    return axios.put(API_URL + `quizzes/${id}`, { title, questions }, { headers: authService.authHeader() });
};

const deleteQuiz = (id) => {
    return axios.delete(API_URL + `quizzes/${id}`, { headers: authService.authHeader() });
};

const getForums = () => {
    return axios.get(API_URL + 'forums', { headers: authService.authHeader() });
};

const createForum = (title) => {
    return axios.post(API_URL + 'forums', { title }, { headers: authService.authHeader() });
};

const createPost = (forumId, content) => {
    return axios.post(API_URL + `forums/${forumId}/posts`, { content }, { headers: authService.authHeader() });
};

const getProgress = () => {
    return axios.get(API_URL + 'progress', { headers: authService.authHeader() });
};

const saveProgress = (courseId, moduleId, progress) => {
    return axios.post(API_URL + 'progress', { courseId, moduleId, progress }, { headers: authService.authHeader() });
};
const apiService = {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    rateCourse,
    getModules,
    createModule,
    updateModule,
    deleteModule,
    getQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getForums,
    createForum,
    createPost,
    getProgress,
    saveProgress,
};

export default apiService;