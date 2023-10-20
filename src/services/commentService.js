const Lesson = require("../models/lesson.model");
const Comment = require("../models/comment.modal");
const ReplyComment = require("../models/replyComment.modal");

const ApiError = require("../ultils/ApiError");
const { StatusCodes } = require("http-status-codes");

const getCommentsByLessonId = async (lessonId) => {
  try {
    if (!lessonId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy bài học");
    }
    const comments = await Comment.find({ lesson: lessonId })
      .populate("user", "name avatar")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "name avatar", // Tên model của User
        },
      })
      .sort({ createdAt: "desc" });
    return { data: comments };
  } catch (error) {
    throw error;
  }
};

const createComment = async (lessonId, user, comment) => {
  try {
    if (!lessonId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy bài học");
    }

    if (!comment) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Nội dung không được để trống"
      );
    }

    const lesson = await Lesson.findOne({ _id: lessonId });
    if (!lesson) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy bài học");
    }
    const newComment = new Comment({
      comment: comment,
      user: user.userId,
      lesson: lessonId,
    });

    await newComment.save();

    const commentsLesson = await Comment.find({ lesson: lessonId })
      .populate("user", "name avatar")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "name avatar", // Tên model của User
        },
      })
      .sort({ createdAt: "desc" });

    return { data: commentsLesson, message: "Bình luận thành công" };
  } catch (error) {
    throw error;
  }
};

const likeComment = async (userInfo, commentId) => {
  try {
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy bình luận");
    }
    if (comment.likes.includes(userInfo.userId)) {
      const newCommentLike = comment.likes.filter(
        (user) => user != userInfo.userId
      );
      comment.likes = newCommentLike;
    } else {
      comment.likes.push(userInfo.userId);
    }
    await comment.save();
    return { data: comment };
  } catch (error) {
    throw error;
  }
};

const replyComment = async (commentId, userInfo, replyComment) => {
  try {
    const comment = await Comment.findOne({ _id: commentId })
      .populate("user", "name avatar")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "name avatar", // Tên model của User
        },
      });
    if (!comment) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy bình luận");
    }

    const newReplyComment = new ReplyComment({
      textComment: replyComment,
      user: userInfo.userId,
      comment: commentId,
    });

    await newReplyComment.save();

    // Thêm phản hồi mới vào mảng replies của bình luận
    comment.replies.push(newReplyComment);
    await comment.save();

    const newComment = await Comment.findOne({ _id: commentId })
      .populate("user", "name avatar")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "name avatar", // Tên model của User
        },
      });

    return { data: newComment };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCommentsByLessonId,
  createComment,
  likeComment,
  replyComment,
};
