const Lesson = require("../models/lesson.model");
const Chapter = require("../models/chapter.model");
const User = require("../models/user.model");

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(401)
        .json({ status: "ERR", message: "Không tìm thấy khoá học" });
    }
    const lesson = await Lesson.findOne({ _id: id });
    if (!lesson) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Không tìm thấy khoá học" });
    }
    return res.status(200).json({ status: "OK", data: lesson });
  } catch (error) {
    return res.status(500).json({ status: "ERR", message: "lỗi server" });
  }
};

const addLesson = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { title, content, resources } = req.body;

    if (!title || !content || !resources) {
      return res
        .status(401)
        .json({ status: "ERR", message: "Thông tin không được để trống" });
    }

    const chapter = await Chapter.findOne({ _id: chapterId });
    if (!chapter) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Chương học không tồn tại" });
    }

    const newLesson = new Lesson({
      ...req.body,
    });

    await newLesson.save();

    chapter.lessons.push(newLesson._id);

    await chapter.save();

    return res
      .status(201)
      .json({ ststus: "OK", message: "tạo bài học thành công" });
  } catch (error) {
    return res.status(500).json({ status: "ERR", message: "lỗi server" });
  }
};

const learnedLession = async (req, res) => {
  try {
    const { userId, lessonId } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Người dùng không tồn tại" });
    }

    const lesson = await Lesson.findOne({ _id: lessonId });
    if (!lesson) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Người dùng không tồn tại" });
    }

    if (!lesson.userLearneds.includes(user._id)) {
      lesson.userLearneds.push(user._id);
      await lesson.save();
    }

    return res
      .status(200)
      .json({ status: "OK", message: "Hoàn thành bài học" });
  } catch (error) {
    return res.status(500).json({ status: "ERR", message: "Lỗi server" });
  }
};

module.exports = {
  getById,
  addLesson,
  learnedLession,
};
