import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const ForumPage = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/forum', { headers: authService.authHeader() });
                setPosts(response.data);
            } catch (error) {
                setError('Error fetching forum posts');
                console.error('Error fetching forum posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleAddPost = async () => {
        if (!newPost.trim()) {
            setError('Post content cannot be empty');
            return;
        }
        try {
            const response = await axios.post('/api/forum', { content: newPost }, { headers: authService.authHeader() });
            setPosts([...posts, response.data]);
            setNewPost('');
        } catch (error) {
            setError('Error adding post');
            console.error('Error adding post:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h1>Forum</h1>
            {posts.map((post) => (
                <div key={post.id} className="card">
                    <h3>{post.owner}</h3>
                    <p>{post.content}</p>
                </div>
            ))}
            <div className="form-group">
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Write a new post"
                />
                <button onClick={handleAddPost}>Add Post</button>
            </div>
        </div>
    );
};

export default ForumPage;