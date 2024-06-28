import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const CertificatePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('/api/courses', { headers: authService.authHeader() });
                setCourses(response.data);
            } catch (error) {
                setError('Error fetching courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleGenerateCertificate = async (courseId) => {
        try {
            const response = await axios.post('/api/certificates', { courseId }, {
                headers: authService.authHeader(),
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', response.headers['content-disposition'].split('filename=')[1]);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setError('Error generating certificate');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Generate Certificates</h1>
            <ul>
                {courses.map((course) => (
                    <li key={course.id}>
                        {course.title}
                        <button onClick={() => handleGenerateCertificate(course.id)}>Generate Certificate</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CertificatePage;