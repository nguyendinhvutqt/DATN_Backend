const Lesson = require("../models/lesson.model");
const Chapter = require("../models/chapter.model");
const User = require("../models/user.model");
const ApiError = require("../ultils/ApiError");
const { StatusCodes } = require("http-status-codes");
const xlsx = require("xlsx");
const fs = require("fs");

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

const addLesson = async (chapterId, data, file) => {
  try {
    const { title, content, resources, text } = data;

    if (!title || !content || (!resources && !text && !file)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Thông tin không được để trống"
      );
    }

    const chapter = await Chapter.findOne({ _id: chapterId });
    if (!chapter) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Chương học không tồn tại");
    }

    let newLesson;

    if (resources.length > 0) {
      newLesson = new Lesson({
        title,
        content,
        resources,
      });
    }

    if (text.length > 0) {
      newLesson = new Lesson({
        title,
        content,
        docs: text,
      });
    }

    if (file) {
      // Đọc nội dung của file Excel
      const workbook = xlsx.readFile(file.path);
      // Lấy danh sách các sheet trong workbook
      const sheetNames = workbook.SheetNames;

      sheetNames.forEach((sheetName) => {
        // Lấy dữ liệu từ mỗi sheet
        const sheet = workbook.Sheets[sheetName];
        // Chuyển đổi dữ liệu từ sheet thành mảng đối tượng
        const data = xlsx.utils.sheet_to_json(sheet);
        const keys = Object.keys(data[0]);
        const quizz = {
          question: keys[0],
          answers: {
            a: keys[1],
            b: keys[2],
            c: keys[3],
            d: keys[4],
          },
          answerCorrect: keys[5],
        };
        fs.unlinkSync(file.path);

        newLesson = new Lesson({
          title,
          content,
          quizz: quizz,
        });
      });
    }
    await newLesson.save();

    chapter.lessons.push(newLesson._id);

    await chapter.save();

    return { data: newLesson, message: "Thêm mới bài học thành công" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const editLesson = async (lessonId, data) => {
  try {
    const { title, content, resources, docs } = data;
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

    if (docs) {
      lesson.docs = docs;
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

const learnedLession = async (userInfo, data) => {
  try {
    const { lessonId } = data;
    const user = await User.findOne({ _id: userInfo.userId });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Người dùng không tồn tại");
    }

    const lesson = await Lesson.findOne({ _id: lessonId });
    if (!lesson) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Bài học không tồn tại");
    }

    if (!lesson.userLearneds.includes(user._id)) {
      lesson.userLearneds.push(user._id);
      await lesson.save();
    }

    return { message: "Hoàn thành bài học" };
  } catch (error) {
    console.log(error);
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
