const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Đảm bảo không có hai người dùng nào có cùng tên đăng nhập
    },
    password: {
      type: String,
      required: true,
    },
    // Các thông tin khác về người dùng có thể thêm vào ở đây, ví dụ như tên, hình ảnh đại diện, vị trí, v.v.
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "/images/avatar-default.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    // refreshTokenExpiry: {
    //   type: Date,
    // },
    // Danh sách các khoá học bài viết mà người dùng đã tham gia hoặc tạo
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    createdBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
