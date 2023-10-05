const mongoose = require("mongoose");

const ReplyCommentSchema = new mongoose.Schema(
  {
    replyText: { type: String }, // Nội dung phản hồi
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, // Tham chiếu đến bình luận mà phản hồi liên quan
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Tham chiếu đến người dùng tạo phản hồi (nếu cần)
    createdAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ReplyComment", ReplyCommentSchema);
