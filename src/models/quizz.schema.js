const mongoose = require("mongoose");

const QuizzSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
  question: { type: String, required: true },
  answers: { type: [String], required: true },
  answerCorrect: { type: String, required: true },
});

module.exports = mongoose.model("Quizz", QuizzSchema);
