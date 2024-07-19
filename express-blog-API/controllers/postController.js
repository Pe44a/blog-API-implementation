const Post = require("../models/post");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Get all Posts
exports.post_list = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find().sort({ createdAt: -1 }).populate('comments').exec();
  res.json(allPosts);
});

// Get a specific Post
exports.post_detail = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).exec();
  if (post === null) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

// Create Post
exports.post_create = [
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("content", "Content must not be empty.").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      // comments will be an empty array by default
      createdAt: new Date() // This will be set automatically if we don't provide it
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const savedPost = await post.save();
      res.status(201).json(savedPost);
    }
  }),
];

// Update Post
exports.post_update = [
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("content", "Content must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("published", "Published status must be specified.").isBoolean().toBoolean(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

      post.title = req.body.title;
      post.content = req.body.content;
      post.published = req.body.published;
      // We don't update comments or createdAt here

      const updatedPost = await post.save();
      res.json(updatedPost);
    }
  }),
];

// Delete Post
exports.post_delete = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).exec();

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Delete all comments associated with the post
  await Comment.deleteMany({ _id: { $in: post.comments } }).exec();

  // Delete the post
  await Post.findByIdAndDelete(req.params.id).exec();

  res.json({ deletedID: req.params.id });
});