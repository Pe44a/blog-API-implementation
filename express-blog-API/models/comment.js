const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
    username: { type: String, required: true, maxLength: 100 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  


// Export model
module.exports = mongoose.model("Comment", CommentSchema);