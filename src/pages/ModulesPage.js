import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const ModulesPage = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newModule, setNewModule] = useState('');

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await axios.get('/api/modules', { headers: authService.authHeader() });
                setModules(response.data);
            } catch (error) {
                setError('Error fetching modules');
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);

    const handleAddModule = async () => {
        if (!newModule.trim()) {
            setError('Module title cannot be empty');
            return;
        }
        try {
            const response = await axios.post('/api/modules', { title: newModule }, { headers: authService.authHeader() });
            setModules([...modules, response.data]);
            setNewModule('');
        } catch (error) {
            setError('Error adding module');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Modules</h1>
            <ul>
                {modules.map(module => (
                    <li key={module.id}>{module.title}</li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value)}
                    placeholder="New Module"
                />
                <button onClick={handleAddModule}>Add Module</button>
            </div>
        </div>
    );
};

export default ModulesPage;