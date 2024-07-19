const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');
const authenticateJWT = require('./authenticateJWT')

// Authentication routes
router.post('/login', authenticateJWT.login);
router.post('/admin', authenticateJWT.authMiddleware);


// Post routes
router.get('/', post_controller.post_list);
router.get('/post/:id', post_controller.post_detail);
router.post('/post/create',authenticateJWT.authMiddleware , post_controller.post_create);
router.put('/post/:id',authenticateJWT.authMiddleware ,post_controller.post_update);
router.delete('/post/:id',authenticateJWT.authMiddleware ,post_controller.post_delete);

// Comment routes
router.get('/posts/:postId/comments', comment_controller.post_comments_list);
router.post('/comment/create', comment_controller.comment_create);
router.put('/comment/:id',authenticateJWT.authMiddleware , comment_controller.comment_update);
router.delete('/comment/:id',authenticateJWT.authMiddleware , comment_controller.comment_delete);

module.exports = router;