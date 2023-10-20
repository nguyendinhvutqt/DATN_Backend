const Lesson = require("../models/lesson.model");
const Comment = require("../models/comment.modal");
const ReplyComment = require("../models/replyComment.modal");
const commentService = require("../services/commentService");
const { StatusCodes } = require("http-status-codes");

const getCommentsByLessonId = async (req, res, next) => {
  try {
    const result = await commentService.getCommentsByLessonId(
      req.params.lessonId
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await commentService.createComment(
      req.params.lessonId,
      user,
      req.body.comment
    );
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

const likeComment = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await commentService.likeComment(user, req.params.commentId);

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const replyComment = async (req, res) => {
  try {
    const result = await commentService.replyComment(
      req.params.commentId,
      req.user,
      req.body.replyComment
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsByLessonId,
  likeComment,
  replyComment,
};
