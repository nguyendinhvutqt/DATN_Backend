const express = require("express");
const {
  getById,
  learnedLession,
  deleteLesson,
  editLesson,
  addLesson,
} = require("../../controllers/lesson.controller");
const { authAdminMiddleware } = require("../../middlewares/auth");
const router = express.Router();

// /api/v1/lessons/:chapterId/lesson
router.route("/:chapterId/lesson").post(authAdminMiddleware, addLesson);

// /api/v1/lessons/:lessonId
router
  .route("/:lessonId")
  .get(getById)
  .put(authAdminMiddleware, editLesson)
  .delete(authAdminMiddleware, deleteLesson);

// /api/v1/lessons/learned
router.post("/learned", learnedLession);

module.exports = router;
