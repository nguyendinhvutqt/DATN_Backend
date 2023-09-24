const Course = require("../models/course.model");
const User = require("../models/user.model");

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: "chapters",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    });
    if (!courses) {
      return res
        .status(404)
        .json({ status: "ERR", messase: "Không tìm thấy khoá học" });
    }
    return res.status(200).json({ status: "OK", data: courses });
  } catch (error) {
    return res.status(500).json({ status: "ERR", messase: "Lỗi Server" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Course.findOne({ _id: id }).populate({
      path: "chapters",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    });

    if (!course) {
      return res
        .status(404)
        .json({ status: "ERR", messase: "Không tìm thấy khoá học" });
    }

    return res.status(200).json({ status: "OK", data: course });
  } catch (error) {
    return res.status(500).json({ status: "ERR", messase: "Lỗi Server" });
  }
};

const addCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description || !req.file) {
      return res
        .status(400)
        .json({ status: "ERR", messase: "Thông tin không được bỏ trống" });
    }
    const course = await Course.create({
      title,
      description,
      thumbnail: `/images/${req.file.filename}`,
    });
    return res
      .status(201)
      .json({
        status: "OK",
        data: course,
        message: "Tạo mới khoá học thành công",
      });
  } catch (error) {
    return res.status(500).json({ status: "ERR", messase: "Lỗi Server" });
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
        .status(400)
        .json({ status: "ERR", message: "Sửa khoá học thất bại" });
    }
    return res
      .status(200)
      .json({ status: "OK", data: course, message: "Sửa khoá học thành công" });
  } catch (error) {
    return res.status(500).json({ status: "ERR", messase: "Lỗi Server" });
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
    return res.status(500).json({ status: "ERR", messase: "Lỗi Server" });
  }
};

// Đăng kí khoá học
const registerCourse = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    // Kiểm tra xem khoá học và người dùng có tồn tại không
    if (!course || !user) {
      return res.status(404).json({
        status: "ERR",
        message: "Không tìm thấy khoá học hoặc người dùng",
      });
    }

    // Kiểm tra xem người dùng đã đăng kí khoá học này chưa
    if (user.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Người dùng đã đăng kí khoá học này" });
    }

    // Thêm khoá học vào danh sách khoá học của người dùng
    user.enrolledCourses.push(courseId);
    await user.save();

    // Thêm người dùng vào danh sách học viên của khoá học
    course.students.push(userId);
    await course.save();

    return res
      .status(200)
      .json({ status: "OK", message: "Đăng kí khoá học thành công" });
  } catch (error) {
    return res.status(500).json({ status: "ERR", messase: "Lỗi Server" });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  addCourse,
  editCourse,
  delCourse,
  registerCourse,
};
