const { StatusCodes } = require("http-status-codes");
const Chapter = require("../models/chapter.model");
const Course = require("../models/course.model");
const ApiError = require("../ultils/ApiError");

const createChapter = async (courseId, title) => {
  try {
    if (!title) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Thông tin không được bỏ trống"
      );
    }

    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Khoá học không tồn tại");
    }

    const newChapter = new Chapter({
      title,
    });

    await newChapter.save();

    course.chapters.push(newChapter._id);
    await course.save();

    return { data: newChapter, message: "Tạo mới chương thành công" };
  } catch (error) {
    throw error;
  }
};

const editChapter = async (chapterId, title) => {
  try {
    const chapter = await Chapter.findOne({ _id: chapterId })
      .populate("lessons")
      .exec();
    if (!chapter) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy chương học");
    }
    if (title) {
      chapter.title = title;
    }
    await chapter.save();
    return { data: chapter, message: "Sửa chương thành công" };
  } catch (error) {
    throw error;
  }
};

const deleteChapter = async (chapterId) => {
  try {
    if (!chapterId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Xoá chương thất bại");
    }
    await Chapter.findByIdAndDelete(chapterId);

    return { message: "Xoá chương thành công" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createChapter,
  editChapter,
  deleteChapter,
};
