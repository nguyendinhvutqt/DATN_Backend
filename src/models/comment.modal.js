const mongoose = require("mongoose");

// Schema cho Bình Luận (Comment)
const CommentSchema = new mongoose.Schema({
  comment: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReplyComment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Comment", CommentSchema);
