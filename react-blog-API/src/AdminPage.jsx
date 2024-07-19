import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AdminPage = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [editingPost, setEditingPost] = useState(null);
    const [error, setError] = useState(null);
    const [expandedPosts, setExpandedPosts] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        fetchPosts();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await axios.post('http://localhost:3000/admin', null, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Authorization failed:', error);
            navigate('/login');
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleCreatePost = async () => {
        try {
            const response = await axios.post('http://localhost:3000/post/create', newPost, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNewPost({ title: '', content: '' });
            setPosts((prevPosts) => [...prevPosts, response.data]); 
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post. Please try again.');
        }
    };

    const handleUpdatePost = async (id) => {
        try {
            await axios.put(`http://localhost:3000/post/${id}`, editingPost, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
    
            // Update the 'posts' array directly after successful update
            setPosts(prevPosts => prevPosts.map(post => 
                post._id === id ? { ...post, ...editingPost } : post
            ));
    
            setEditingPost(null);
        } catch (error) {
            console.error('Error updating post:', error);
            setError('Failed to update post. Please try again.');
        }
    };
    

    const handleDeletePost = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
          try {
            await axios.delete(`http://localhost:3000/post/${id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
    
            // Update posts state after deletion
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id)); 
          } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post. Please try again.');
          }
        }
      };

      const handleDeleteComment = async (commentId, postId) => { 
        try {
            await axios.delete(`http://localhost:3000/comment/${commentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            // Update the comments for the specific post 
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId 
                        ? { 
                            ...post, 
                            comments: post.comments.filter((c) => c._id !== commentId) 
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Error deleting comment:', error);
            setError('Failed to delete comment. Please try again.');
        }
    };

    const toggleComments = (postId) => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            {error && <div className="error-message">{error}</div>}
            
            <div className="new-post-form">
                <h2>Create New Post</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
                <textarea
                    placeholder="Content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows="10"
                />
                <button className="admin-button" onClick={handleCreatePost}>Create Post</button>
            </div>

            <div className="posts-list">
                <h2>All Posts</h2>
                {posts.map(post => (
                    <div key={post._id} className="post-item">
                        {editingPost && editingPost._id === post._id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingPost.title}
                                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                />
                                <textarea
                                    value={editingPost.content}
                                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                                    rows="5"
                                />
                                <button className="admin-button" onClick={() => handleUpdatePost(post._id)}>Save</button>
                                <button className="admin-button" onClick={() => setEditingPost(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <h3>{post.title}</h3>
                                <p>{post.content.substring(0, 100)}...</p>
                                <button className="admin-button" onClick={() => setEditingPost(post)}>Edit</button>
                                <button className="admin-button" onClick={() => handleDeletePost(post._id)}>Delete</button>
                                <button className="admin-button" onClick={() => toggleComments(post._id)}>
                                    {expandedPosts[post._id] ? <ChevronUp /> : <ChevronDown />} Comments
                                </button>
                            </>
                        )}
                        {expandedPosts[post._id] && (
                            <div className="comments-section">
                                <h4>Comments</h4>
                                {post.comments.map(comment => (
                                    <div key={comment._id} className="comment-item">
                                        <p><strong>Username:</strong> {comment.username}</p>
                                        <p><strong>Comment:</strong> {comment.comment}</p>
                                        <button className="admin-button" onClick={() => handleDeleteComment(comment._id, post._id)}>Delete Comment</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;