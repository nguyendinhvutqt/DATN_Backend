const Chapter = require("../models/chapter.model");
const Course = require("../models/course.model");

const addChapter = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res
        .status(401)
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
      .status(401)
      .json({ status: "ERR", message: "Tạo bài học thất bại" });
  }
};

module.exports = {
  addChapter,
};
