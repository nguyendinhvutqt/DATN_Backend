const express = require("express");
const {
  getById,
  learnedLession,
  deleteLesson,
  editLesson,
} = require("../controllers/lesson.controller");
const router = express.Router();

router.get("/:id", getById);
router.post("/learned", learnedLession);
router.put("/:lessonId", editLesson);
router.delete("/:lessonId", deleteLesson);

module.exports = router;
