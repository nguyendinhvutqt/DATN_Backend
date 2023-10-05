const express = require("express");
const { addLesson } = require("../controllers/lesson.controller");
const {
  deleteChapter,
  editChapter,
} = require("../controllers/chapter.controller");
const router = express.Router();

router.post("/:chapterId/lesson", addLesson);
router.put("/:chapterId", editChapter);
router.delete("/:chapterId", deleteChapter);

module.exports = router;
