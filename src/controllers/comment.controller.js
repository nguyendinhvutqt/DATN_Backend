const Lesson = require("../models/lesson.model");

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

module.exports = {
  getComment,
  addComment,
};
