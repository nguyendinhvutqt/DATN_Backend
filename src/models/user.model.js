const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
        default: "user",
      },
    ],
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
