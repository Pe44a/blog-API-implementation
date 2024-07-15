const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment"}],
    published: { type: Boolean, default: false, required: true },
    createdAt: { type: Date, default: Date.now, required: true }
  });
  

// Export model
module.exports = mongoose.model("Post", PostSchema);