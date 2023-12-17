const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    resources: { type: String },
    docs: { type: String },
    quizz: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quizz" }],
    userLearneds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", LessonSchema);
