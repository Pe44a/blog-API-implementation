import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlogMainPage = () => {
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
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
      {posts.map(post => (
        <div key={post._id} className="mb-6">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p>
          <p className="mt-2">{post.content.substring(0, 200)}...</p>
          <a href={`/post/${post._id}`} className="text-blue-500 hover:underline">Read more</a>
        </div>
      ))}
    </div>
  );
};

export default BlogMainPage;