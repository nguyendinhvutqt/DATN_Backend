const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  resources: [{ type: String }],
});

module.exports = mongoose.model("Lesson", lessonSchema);
