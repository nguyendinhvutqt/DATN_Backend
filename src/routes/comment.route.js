const express = require("express");
const router = express.Router();
const { getComment, addComment } = require("../controllers/comment.controller");

router.get("/", getComment);
router.post("/:lessonId/comment", addComment);

module.exports = router;
