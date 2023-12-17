const Lesson = require("../models/lesson.model");
const Chapter = require("../models/chapter.model");
const Quizz = require("../models/quizz.schema");
const User = require("../models/user.model");
const ApiError = require("../ultils/ApiError");
const { StatusCodes } = require("http-status-codes");
const xlsx = require("xlsx");
const fs = require("fs");

const getById = async (lessonId) => {
  if (!lessonId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy khoá học");
  }
  const lesson = await Lesson.findOne({ _id: lessonId }).populate("quizz");
  if (!lesson) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy khoá học");
  }
  return { data: lesson };
};

const addLesson = async (chapterId, data, file) => {
  try {
    const { title, content, resources, text, courseId } = data;

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

      sheetNames.forEach(async (sheetName) => {
        // Lấy dữ liệu từ mỗi sheet
        const sheet = workbook.Sheets[sheetName];
        // Chuyển đổi dữ liệu từ sheet thành mảng đối tượng
        const data = xlsx.utils.sheet_to_json(sheet);

        newLesson = new Lesson({
          title: title,
          content: content,
        });
        let arrQuizz = [];
        for await (const quizz of data) {
          let answers = [];
          answers.push(quizz.answerA);
          answers.push(quizz.answerB);
          answers.push(quizz.answerC);
          answers.push(quizz.answerD);

          const newQuizz = new Quizz({
            courseId: courseId,
            chapterId: chapterId,
            question: quizz.question,
            answers: answers,
            answerCorrect: quizz.answerCorrect,
          });
          await newQuizz.save();
          arrQuizz.push(newQuizz._id);
        }
        newLesson.quizz = arrQuizz;
        await newLesson.save();
      });
    }
    fs.unlinkSync(file.path);
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
