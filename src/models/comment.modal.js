const mongoose = require("mongoose");

// Tạo Schema cho Comment
const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến Schema của người dùng
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson", // Tham chiếu đến Schema của bài học
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Sử dụng timestamps để tự động tạo createdAt và updatedAt
);

// Tạo một model từ Schema
module.exports = mongoose.model("Comment", CommentSchema);
