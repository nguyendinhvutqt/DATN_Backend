const express = require("express");
const { addLesson } = require("../controllers/lesson.controller");
const { deleteChapter } = require("../controllers/chapter.controller");
const router = express.Router();

router.post("/:chapterId/lesson", addLesson);
router.delete("/:chapterId", deleteChapter);

module.exports = router;
