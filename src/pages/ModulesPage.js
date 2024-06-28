import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const ModulesPage = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newModule, setNewModule] = useState('');
    const [editingModule, setEditingModule] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

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

    const handleEditModule = async () => {
        if (!editingTitle.trim()) {
            setError('Module title cannot be empty');
            return;
        }
        try {
            const response = await axios.put(`/api/modules/${editingModule.id}`, { title: editingTitle }, { headers: authService.authHeader() });
            const updatedModules = modules.map((module) =>
                module.id === editingModule.id ? response.data : module
            );
            setModules(updatedModules);
            setEditingModule(null);
            setEditingTitle('');
        } catch (error) {
            setError('Error editing module');
        }
    };

    const handleDeleteModule = async (id) => {
        try {
            await axios.delete(`/api/modules/${id}`, { headers: authService.authHeader() });
            setModules(modules.filter((module) => module.id !== id));
        } catch (error) {
            setError('Error deleting module');
        }
    };

    const startEditing = (module) => {
        setEditingModule(module);
        setEditingTitle(module.title);
    };

    const cancelEditing = () => {
        setEditingModule(null);
        setEditingTitle('');
    };

    const currentUser = authService.getCurrentUser();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Modules</h1>
            <ul>
                {modules.map((module) => (
                    <li key={module.id}>
                        {module.title}
                        {module.owner === currentUser?.username && (
                            <>
                                <button onClick={() => startEditing(module)}>Edit</button>
                                <button onClick={() => handleDeleteModule(module.id)}>Delete</button>
                            </>
                        )}
                    </li>
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
            {editingModule && (
                <div>
                    <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        placeholder="Edit Module"
                    />
                    <button onClick={handleEditModule}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default ModulesPage;