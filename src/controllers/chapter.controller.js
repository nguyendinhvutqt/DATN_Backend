const Chapter = require("../models/chapter.model");
const Course = require("../models/course.model");

const addChapter = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Thông tin không được để trống" });
    }

    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Khoá học không tồn tại" });
    }

    const newChapter = new Chapter({
      title,
    });

    await newChapter.save();

    course.chapters.push(newChapter._id);
    await course.save();

    return res
      .status(201)
      .json({ status: "OK", message: "Tạo mới chương thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "ERR", message: "Lỗi server: ", error });
  }
};

const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    if (!chapterId) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Xoá chương thất bại" });
    }
    await Chapter.findByIdAndDelete(chapterId);

    return res
      .status(201)
      .json({ status: "OK", message: "Xoá chương thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "ERR", message: "Lỗi server: ", error });
  }
};

module.exports = {
  addChapter,
  deleteChapter,
};
