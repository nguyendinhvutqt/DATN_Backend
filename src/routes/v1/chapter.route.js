const express = require("express");
const {
  deleteChapter,
  editChapter,
  addChapter,
} = require("../../controllers/chapter.controller");
const { authAdminMiddleware } = require("../../middlewares/auth");
const router = express.Router();

// /api/v1/chapters/:courseId/chapter
router.route("/:courseId/chapter").post(authAdminMiddleware, addChapter);

// /api/v1/chapter/:chapterId
router
  .route("/:chapterId")
  .put(authAdminMiddleware, editChapter)
  .delete(authAdminMiddleware, deleteChapter);



module.exports = router;
