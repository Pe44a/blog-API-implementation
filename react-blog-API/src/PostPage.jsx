import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const BlogPostPage = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          axios.get(`http://localhost:3000/post/${id}`),
          axios.get(`http://localhost:3000/posts/${id}/comments`)
        ]);
        setPost(postResponse.data);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching post and comments:', error);
      }
    };

    fetchPostAndComments();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to="/">&larr; Back to all posts</Link>
      <h1>{post.title}</h1>
      <p>{new Date(post.createdAt).toLocaleDateString()}</p>
      <div className="mb-8">{post.content}</div>
      
      <h2>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map(comment => (
          <div key={comment._id} >
            <p>{comment.username}</p>
            <p>{new Date(comment.createdAt).toLocaleString()}</p>
            <p>{comment.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BlogPostPage;