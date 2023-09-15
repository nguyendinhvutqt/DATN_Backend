const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
});

module.exports = mongoose.model("Course", CourseSchema);
