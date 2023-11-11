const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    googleId: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "/images/avatar-default.png",
    },
    roles: [
      {
        type: String,
        enum: ["user", "admin"],
      },
    ],
    status: {
      type: String,
      enum: ["Hoạt động", "Đã khoá"],
      default: "Hoạt động",
    },
    refreshToken: {
      type: String,
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    createdBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
