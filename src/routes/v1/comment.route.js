const express = require("express");
const router = express.Router();
const {
  getCommentsByLessonId,
  createComment,
  likeComment,
  replyComment,
} = require("../../controllers/comment.controller");
const { authUserMiddleware } = require("../../middlewares/auth");

// /api/v1/comments/:lesonId/comment
router
  .route("/:lessonId/comment")
  .get(authUserMiddleware, getCommentsByLessonId)
  .post(authUserMiddleware, createComment);

// /api/v1/comments/:lesonId/like
router.put("/:commentId/like", authUserMiddleware, likeComment);

// /api/v1/comments/:lesonId/reply
router.put("/:commentId/reply", authUserMiddleware, replyComment);

module.exports = router;
