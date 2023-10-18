const Lesson = require("../models/lesson.model");
const Comment = require("../models/comment.modal");
const ReplyComment = require("../models/replyComment.modal");

const getComment = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const comments = await Lesson.findOne({ _id: lessonId })
      .sort({ "comments.createdAt": "desc" })
      .populate("comments.userId", "name avatar");
    if (!comments) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Không tìm thấy bình luận" });
    }
    return res.status(200).json({
      status: "OK",
      data: comments,
    });
  } catch (error) {
    return res.status(500).json({ status: "ERR", message: "Lỗi server" });
  }
};

const addComment = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { comment, userId } = req.body;

    if (!lessonId) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Không tìm thấy bài học" });
    }

    if (!comment) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Nội dung không được để trống" });
    }

    const newComment = {
      comment: comment,
      userId: userId,
    };

    await Lesson.findByIdAndUpdate(
      lessonId,
      {
        $push: { comments: newComment },
      },
      { new: true }
    );

    // const lesson = await Lesson.findOne({ _id: lessonId });
    // if (!lesson) {
    //   return res
    //     .status(404)
    //     .json({ status: "ERR", message: "Không tìm thấy bài học" });
    // }

    // lesson.comments.push({
    //   comment: comment,
    //   userId: userId,
    // });

    // await lesson.save();

    const lessonComment = await Lesson.findOne({ _id: lessonId })
      .sort({ "comments.createdAt": "desc" })
      .populate("comments.userId", "name avatar");

    return res.status(201).json({
      status: "OK",
      data: lessonComment,
      message: "Bình luận thành công",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "ERR", message: "Lỗi server" });
  }
};

const getCommentsByLessonId = async (req, res) => {
  try {
    const { lessonId } = req.params;
    if (!lessonId) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Không tìm thấy bài học" });
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
    return res.status(200).json({
      status: "OK",
      data: comments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "ERR", message: "Lỗi server" });
  }
};

const createComment = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { comment, userId } = req.body;

    if (!lessonId) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Không tìm thấy bài học" });
    }

    if (!comment) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Nội dung không được để trống" });
    }

    const lesson = await Lesson.findOne({ _id: lessonId });
    if (!lesson) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Không tìm thấy bài học" });
    }
    const newComment = new Comment({
      comment: comment,
      user: userId,
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

    return res.status(201).json({
      status: "OK",
      data: commentsLesson,
      message: "Bình luận thành công",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "ERR", message: "Lỗi server" });
  }
};

const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Không tìm thấy bình luận" });
    }
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((user) => user != userId);
    } else {
      comment.likes.push(userId);
    }
    await comment.save();
    console.log("comment: ", comment);
    return res.status(200).json({
      status: "OK",
      data: comment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "ERR", message: "Lỗi server" });
  }
};

const replyComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, replyComment } = req.body;
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
      return res
        .status(404)
        .json({ status: "ERR", message: "Không tìm thấy bình luận" });
    }

    const newReplyComment = new ReplyComment({
      textComment: replyComment,
      user: userId,
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

    return res.status(200).json({
      status: "OK",
      data: newComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "ERR", message: "Lỗi server" });
  }
};

module.exports = {
  getComment,
  addComment,
  createComment,
  getCommentsByLessonId,
  likeComment,
  replyComment,
};
