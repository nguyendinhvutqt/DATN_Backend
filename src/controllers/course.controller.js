const Course = require("../models/course.model");

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    if (!courses) {
      return res
        .status(404)
        .json({ status: "ERR", messase: "Không tìm thấy khoá học" });
    }
    return res.status(200).json({ status: "OK", data: courses });
  } catch (error) {
    return res
      .status(404)
      .json({ status: "ERR", messase: "Không tìm thấy khoá học" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Course.findOne({ _id: id });

    if (!course) {
      return res
        .status(404)
        .json({ status: "ERR", messase: "Không tìm thấy khoá học" });
    }

    return res.status(200).json({ status: "OK", data: course });
  } catch (error) {
    return res
      .status(404)
      .json({ status: "ERR", message: "Không tìm thấy khoá học" });
  }
};

const addCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description || !req.file) {
      return res
        .status(401)
        .json({ status: "ERR", messase: "Thông tin không được bỏ trống" });
    }
    await Course.create({
      title,
      description,
      thumbnail: `/images/${req.file.filename}`,
    });
    return res
      .status(201)
      .json({ status: "OK", message: "Tạo mới khoá học thành công" });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "ERR", message: "Tạo mới khoá học thất bại" });
  }
};

const editCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Course.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true }
    );
    if (!course) {
      return res
        .status(401)
        .json({ status: "ERR", message: "Sửa khoá học thất bại" });
    }
    return res
      .status(200)
      .json({ status: "OK", data: course, message: "Sửa khoá học thành công" });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "ERR", message: "Sửa khoá học thất bại" });
  }
};

const delCourse = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(404)
        .json({ status: "ERR", messase: "Không tìm thấy khoá học" });
    }
    await Course.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ status: "OK", message: "Xoá khoá học thành công" });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "ERR", message: "Xoá khoá học thất bại" });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  addCourse,
  editCourse,
  delCourse,
};
