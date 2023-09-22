const express = require("express");
const { addLesson } = require("../controllers/lesson.controller");
const router = express.Router();

router.post("/:chapterId/lesson", addLesson);

module.exports = router;
