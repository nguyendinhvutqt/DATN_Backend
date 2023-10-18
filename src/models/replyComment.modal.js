const { default: mongoose } = require("mongoose");

// Schema cho Phản Hồi (Reply)
const ReplyCommentSchema = new mongoose.Schema({
  textComment: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReplyComment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("ReplyComment", ReplyCommentSchema);
