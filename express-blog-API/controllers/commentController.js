const Comment = require("../models/comment");
const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// GET /posts/:postId/comments
exports.post_comments_list = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId).exec();
  
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comments = await Comment.find({ _id: { $in: post.comments } }).exec();
  res.status(200).json(comments);
  });

// Create Comment
exports.comment_create = [
  body("username", "Username must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("comment", "Comment must not be empty.").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      // Check if the post exists
      const post = await Post.findById(req.body.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = new Comment({
        username: req.body.username,
        comment: req.body.comment,
        // createdAt will be set automatically
      });

      const savedComment = await comment.save();

      // Add the comment to the post's comments array
      post.comments.push(savedComment._id);
      await post.save();

      res.status(201).json(savedComment);
    }
  }),
];

// Update Comment
exports.comment_update = [
  body("username", "Username must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("comment", "Comment must not be empty.").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      comment.username = req.body.username;
      comment.comment = req.body.comment;
      // We don't update createdAt

      const updatedComment = await comment.save();
      res.json(updatedComment);
    }
  }),
];

// Delete Comment
exports.comment_delete = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).exec();
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // Find the post that contains this comment
  const post = await Post.findOne({ comments: req.params.id }).exec();
  if (post) {
    // Remove the comment ID from the post's comments array
    post.comments.pull(req.params.id);
    await post.save();
  }

  // Delete the comment
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ deletedID: req.params.id });
});