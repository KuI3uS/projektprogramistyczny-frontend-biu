
import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import authService from '../services/authService';

const ModulesPage = () => {
    const [modules, setModules] = useState([]);
    const [newModule, setNewModule] = useState('');
    const [editingModule, setEditingModule] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await apiService.getModules();
                setModules(response.data);
            } catch (error) {
                console.error('Error fetching modules', error);
            }
        };

        fetchModules();
    }, []);

    const handleAddModule = async () => {
        if (!newModule.trim()) {
            return;
        }
        try {
            const response = await apiService.createModule(newModule);
            setModules([...modules, response.data]);
            setNewModule('');
        } catch (error) {
            console.error('Error adding module', error);
        }
    };

    const handleEditModule = async () => {
        if (!editingTitle.trim()) {
            return;
        }
        try {
            const response = await apiService.updateModule(editingModule.id, editingTitle);
            const updatedModules = modules.map((module) =>
                module.id === editingModule.id ? response.data : module
            );
            setModules(updatedModules);
            setEditingModule(null);
            setEditingTitle('');
        } catch (error) {
            console.error('Error editing module', error);
        }
    };

    const handleDeleteModule = async (id) => {
        try {
            await apiService.deleteModule(id);
            setModules(modules.filter((module) => module.id !== id));
        } catch (error) {
            console.error('Error deleting module', error);
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