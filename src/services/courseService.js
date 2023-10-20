const { StatusCodes } = require("http-status-codes");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const ApiError = require("../ultils/ApiError");

const getCourseById = async (courseId) => {
  try {
    const course = await Course.findOne({ _id: courseId }).populate({
      path: "chapters",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    });
    if (!course) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy khoá học");
    }
    return course;
  } catch (error) {
    throw error;
  }
};

const getCoursesAndPaginate = async (data) => {
  try {
    const { page = 1, limit = 5 } = data;
    const skip = (page - 1) * limit;
    const totalCourse = await Course.count();
    const totalPage = Math.ceil(totalCourse / limit);

    const courses = await Course.find()
      .sort({ createdAt: "desc" })
      .limit(limit)
      .skip(skip);

    return {
      currentPage: +page,
      totalPage: totalPage,
      data: courses,
    };
  } catch (error) {
    throw error;
  }
};

const getCourses = async () => {
  try {
    return await Course.find()
      .sort({ createdAt: "desc" })
      .populate({
        path: "chapters",
        populate: {
          path: "lessons",
          model: "Lesson",
        },
      });
  } catch (error) {
    throw error;
  }
};

const createCourse = async (data, file) => {
  const { title, description } = data;
  if (!title || !description) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Thông tin không được để trống"
    );
  }
  if (!file) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Thông tin không được để trống"
    );
  }
  try {
    const course = await Course.create({
      title: data.title,
      description: data.description,
      thumbnail: `/images/${file.filename}`,
    });
    return { message: "Tạo mới khoá học thành công", data: course };
  } catch (error) {
    throw error;
  }
};

const editCourse = async (courseId, data, file) => {
  try {
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy khoá học");
    }
    if (data.title) {
      course.title = data.title;
    }
    if (data.description) {
      course.description = data.description;
    }
    if (file) {
      course.thumbnail = `/images/${file.filename}`;
    }

    await course.save();

    return { message: "Sửa khoá học thành công", data: course };
  } catch (error) {
    throw error;
  }
};

const deleteCourse = async (courseId) => {
  try {
    await Course.findByIdAndDelete(courseId);
    return { message: "Xoá khoá học thành công" };
  } catch (error) {
    throw error;
  }
};

const registerCourse = async (courseId, userInfo) => {
  try {
    const course = await Course.findById(courseId);
    const user = await User.findById(userInfo.userId);
    if (!course || !user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Không tìm thấy khoá học hoặc người dùng"
      );
    }
    // Kiểm tra xem người dùng đã đăng kí khoá học này chưa
    if (user.enrolledCourses.includes(courseId)) {
      return { message: "Đăng kí khoá học thành công" };
    }
    // Thêm khoá học vào danh sách khoá học của người dùng
    user.enrolledCourses.push(courseId);
    await user.save();
    // Thêm người dùng vào danh sách học viên của khoá học
    course.students.push(userInfo.userId);
    await course.save();
    return { message: "Đăng kí khoá học thành công" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCourseById,
  getCourses,
  getCoursesAndPaginate,
  createCourse,
  editCourse,
  deleteCourse,
  registerCourse,
};
