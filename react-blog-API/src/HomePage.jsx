import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <div key={post._id} className="mb-6">
          <h2>{post.title}</h2>
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          <p>{post.content.substring(0, 200)}...</p>
          <a href={`/post/${post._id}`}>Read more</a>
        </div>
      ))}
    </div>
  );
};

export default HomePage;