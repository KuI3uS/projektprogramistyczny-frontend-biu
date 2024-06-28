import axios from 'axios';

const API_URL = '/api/';

const register = (username, password) => {
    return axios.post(API_URL + 'register', {
        username,
        password,
    });
};

const login = (username, password) => {
    return axios
        .post(API_URL + 'login', {
            username,
            password,
        })
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const setCurrentUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

const authHeader = () => {
    const user = getCurrentUser();
    if (user && user.accessToken) {
        return { Authorization: 'Bearer ' + user.accessToken };
    } else {
        return {};
    }
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    setCurrentUser,
    authHeader,
};

export default authService;