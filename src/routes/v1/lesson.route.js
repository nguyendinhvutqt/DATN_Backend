const express = require("express");
const {
  getById,
  learnedLession,
  deleteLesson,
  editLesson,
  addLesson,
} = require("../../controllers/lesson.controller");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../../middlewares/auth");
const storage = require("../../middlewares/uploadFile");
const multer = require("multer");
const router = express.Router();

const upload = multer({ storage: storage });

// /api/v1/lessons/:chapterId/lesson
router
  .route("/:chapterId/lesson")
  .post(authAdminMiddleware, upload.single("file"), addLesson);

// /api/v1/lessons/:lessonId
router
  .route("/:lessonId")
  .get(getById)
  .put(authAdminMiddleware, editLesson)
  .delete(authAdminMiddleware, deleteLesson);

// /api/v1/lessons/learned
router.post("/learned", authUserMiddleware, learnedLession);

module.exports = router;
