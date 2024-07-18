import React, { useState, useEffect} from 'react';
import axios from 'axios';
import {Link, Outlet} from 'react-router-dom';

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
    <>
      <h1>Blog Posts</h1>
      <div className='post-preview-container'>
        {posts.map(post => {
          const previewLink = `/post/${post._id}`;
          return (
            <div key={post._id} className='post-preview'>
              <h2 className='post-preview-title'>{post.title}</h2>
              <p className='post-preview-text'>{new Date(post.createdAt).toLocaleDateString()}</p>
              <p className='post-preview-text'>{post.content.substring(0, 200)}...</p>
              <div className="preview-link-container">
                <Link className='post-preview-link' to={previewLink}>Read more</Link>
              </div>
            </div>
          );
        })}
      </div>
      <Outlet />
    </>
  );
};

export default HomePage;