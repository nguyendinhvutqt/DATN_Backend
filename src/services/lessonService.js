const Lesson = require("../models/lesson.model");
const Chapter = require("../models/chapter.model");
const User = require("../models/user.model");
const ApiError = require("../ultils/ApiError");
const { StatusCodes } = require("http-status-codes");

const getById = async (lessonId) => {
  if (!lessonId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy khoá học");
  }
  const lesson = await Lesson.findOne({ _id: lessonId });
  if (!lesson) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy khoá học");
  }
  return { data: lesson };
};

const addLesson = async (chapterId, data) => {
  try {
    const { title, content, resources } = data;

    if (!title || !content || !resources) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Thông tin không được để trống"
      );
    }

    const chapter = await Chapter.findOne({ _id: chapterId });
    if (!chapter) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Chương học không tồn tại");
    }

    const newLesson = new Lesson({
      ...data,
    });

    await newLesson.save();

    chapter.lessons.push(newLesson._id);

    await chapter.save();

    return { data: newLesson, message: "Thêm mới bài học thành công" };
  } catch (error) {
    throw error;
  }
};

const editLesson = async (lessonId, data) => {
  try {
    const { title, content, resources } = data;
    if (!lessonId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Bài học không tồn tại");
    }

    const lesson = await Lesson.findOne({ _id: lessonId });
    if (!lesson) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Bài học không tồn tại");
    }

    if (title) {
      lesson.title = title;
    }

    if (content) {
      lesson.content = content;
    }

    if (resources) {
      lesson.resources = resources;
    }

    await lesson.save();

    return { data: lesson, message: "Sửa bài học thành công" };
  } catch (error) {
    throw error;
  }
};

const deleteLesson = async (lessonId) => {
  try {
    if (!lessonId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Bài học không tồn tại");
    }
    await Lesson.findByIdAndDelete({ _id: lessonId });
    return { message: "Xoá bài học thành công" };
  } catch (error) {
    throw error;
  }
};

const learnedLession = async (userId, lessonId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Người dùng không tồn tại");
    }

    const lesson = await Lesson.findOne({ _id: lessonId });
    if (!lesson) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Người dùng không tồn tại");
      return res;
    }

    if (!lesson.userLearneds.includes(user._id)) {
      lesson.userLearneds.push(user._id);
      await lesson.save();
    }

    return { message: "Hoàn thành bài học" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getById,
  addLesson,
  editLesson,
  deleteLesson,
  learnedLession,
};
