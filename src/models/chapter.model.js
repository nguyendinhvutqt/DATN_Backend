const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chapter", ChapterSchema);
