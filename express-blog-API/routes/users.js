const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');

// Post routes
router.get('/', post_controller.post_list);
router.get('/post/:id', post_controller.post_detail);
router.post('/post/create', post_controller.post_create);
router.put('/post/:id', post_controller.post_update);
router.delete('/post/:id', post_controller.post_delete);

// Comment routes
router.get('/posts/:postId/comments', comment_controller.post_comments_list);
router.post('/comment/create', comment_controller.comment_create);
router.put('/comment/:id', comment_controller.comment_update);
router.delete('/comment/:id', comment_controller.comment_delete);

module.exports = router;