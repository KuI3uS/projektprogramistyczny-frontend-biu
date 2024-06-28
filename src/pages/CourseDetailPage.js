import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import authService from '../services/authService';

const CourseDetailPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`/api/courses/${id}`, { headers: authService.authHeader() });
                setCourse(response.data);
            } catch (error) {
                setError('Error fetching course details');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <p>Instructor: {course.instructor}</p>
        </div>
    );
};

export default CourseDetailPage;