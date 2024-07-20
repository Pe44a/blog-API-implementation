import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const PostPage = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ username: '', comment: '' });
  const { id } = useParams();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACK_END_URL}/post/${id}`),
          axios.get(`${import.meta.env.VITE_BACK_END_URL}/posts/${id}/comments`)
        ]);
        setPost(postResponse.data);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching post and comments:', error);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/comment/create`, {
        username: newComment.username,
        comment: newComment.comment,
        postId: id
      });
      setComments([...comments, response.data]);
      setNewComment({ username: '', comment: '' });
    } catch (error) {
      console.error('Error submitting comment:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        // Handle validation errors
        alert(error.response.data.errors.map(err => err.msg).join('\n'));
      } else {
        alert('An error occurred while submitting the comment. Please try again.');
      }
    }
  };

  if (!post) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <Link to='/' className="back-link">&larr; Back to all posts</Link>
      
      <article className='post-container'>
        <h1 className='post-title'>{post.title}</h1>
        <p className='post-date'>{new Date(post.createdAt).toLocaleDateString()}</p>
        <div className='post-content'>{post.content}</div>
      </article>
      
      <h2>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map(comment => (
          <div className='post-comment' key={comment._id}>
            <p className='comment-username'>{comment.username}</p>
            <p className='comment-published'>{new Date(comment.createdAt).toLocaleString()}</p>
            <p className='comment'>{comment.comment}</p>
          </div>
        ))
      )}

        <form className="comment-form" onSubmit={handleCommentSubmit}>
            <h3>Add a Comment</h3>
            <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={newComment.username}
                    onChange={(e) => setNewComment({...newComment, username: e.target.value})}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="comment">Comment:</label>
                <textarea
                    id="comment"
                    value={newComment.comment}
                    onChange={(e) => setNewComment({...newComment, comment: e.target.value})}
                    required
                ></textarea>
            </div>
            <button type="submit" className="submit-button">Submit Comment</button>
        </form>
    </div>
  );
};

export default PostPage;