const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, required: true },
    status: {
      type: String,
      enum: ["Chưa duyệt", "Đã duyệt", "Đã xoá"],
      default: "Chưa duyệt",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //   required: true,
    },
    // Các trường khác cho bài viết có thể được thêm vào ở đây, như thời gian đăng, số lượt xem, v.v.
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", BlogSchema);
