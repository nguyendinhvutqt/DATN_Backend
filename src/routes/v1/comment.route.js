const express = require("express");
const router = express.Router();
const {
  getComment,
  addComment,
  getCommentsByLessonId,
  createComment,
  likeComment,
  replyComment,
} = require("../../controllers/comment.controller");

router.get("/:lessonId/comment", getCommentsByLessonId);
router.post("/:lessonId/comment", createComment);
router.put("/:commentId/like", likeComment);
router.put("/:commentId/reply", replyComment);

module.exports = router;
