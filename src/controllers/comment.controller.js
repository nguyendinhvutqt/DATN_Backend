const Lesson = require("../models/lesson.model");

const getComment = async (req, res) => {
  try {
    // const comments = await Comment.find();
    // if (!comments) {
    //   return res
    //     .status(404)
    //     .json({ status: "ERR", message: "Không tìm thấy bình luận" });
    // }
    // return res.status(200).json({
    //   status: "OK",
    //   data: comments,
    // });
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

    const lesson = await Lesson.findOne({ _id: lessonId });
    if (!lesson) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Không tìm thấy bài học" });
    }

    lesson.comments.push({
      comment: comment,
      userId: userId,
    });

    await lesson.save();

    lesson.populate("comments.userId", "username avatar");

    return res.status(201).json({
      status: "OK",
      data: lesson,
      message: "Bình luận thành công",
    });
  } catch (error) {
    return res.status(500).json({ status: "ERR", message: "Lỗi server" });
  }
};

module.exports = {
  getComment,
  addComment,
};
