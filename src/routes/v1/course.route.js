const express = require("express");
const router = express.Router();
const multer = require("multer");

const xlsx = require("xlsx");
const fs = require("fs");

const Lesson = require("../../models/lesson.model");

const storage = require("../../middlewares/uploadFile");
const {
  addCourse,
  delCourse,
  getCourseById,
  getCourses,
  editCourse,
  registerCourse,
  getCoursesAndPaginate,
  getCourseUnregistered,
  paymentCourse,
} = require("../../controllers/course.controller");
const {
  authUserMiddleware,
  authAdminMiddleware,
} = require("../../middlewares/auth");

const upload = multer({ storage: storage });

// /api/v1/courses/
router
  .route("/")
  .get(getCourses)
  .post(authAdminMiddleware, upload.single("file"), addCourse);

// /api/v1/courses/paginate
router.get("/paginate", getCoursesAndPaginate);

// /api/v1/courses/:courseId
router
  .route("/:courseId")
  .get(getCourseById)
  .put(authAdminMiddleware, upload.single("file"), editCourse)
  .delete(authAdminMiddleware, delCourse);

// /api/v1/courses/register-course
router.post("/register-course", authUserMiddleware, registerCourse);

// /api/v1/courses/course-unregistered
router.get("/register-course", authUserMiddleware, getCourseUnregistered);

// /api/v1/courses/payment
router.post("/payment", authUserMiddleware, paymentCourse);

router.post("/test", upload.single("file"), async (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  // Lấy danh sách các sheet trong workbook
  const sheetNames = workbook.SheetNames;

  sheetNames.forEach(async (sheetName) => {
    // Lấy dữ liệu từ mỗi sheet
    const sheet = workbook.Sheets[sheetName];
    // Chuyển đổi dữ liệu từ sheet thành mảng đối tượng
    const data = xlsx.utils.sheet_to_json(sheet);
    data.forEach((quizz) => console.log(quizz));

    const newLesson = new Lesson({
      title: "abc",
      content: "abc",
    });
    let arrQuizz = [];
    for await (const quizz of data) {
      let answers = [];
      // const dataKey = Object.keys(quizz)
      answers.push(quizz.answerA);
      answers.push(quizz.answerB);
      answers.push(quizz.answerC);
      answers.push(quizz.answerD);

      console.log(answers);

      const newQuizz = new Quizz({
        courseId: req.body.courseId,
        chapterId: req.body.chapterId,
        question: quizz.question,
        answers: answers,
        answerCorrect: quizz.answerCorrect,
      });
      await newQuizz.save();
      arrQuizz.push(newQuizz._id);
      console.log("Question saved successfully!");
    }
    newLesson.quizz = arrQuizz;
    await newLesson.save();
  });

  fs.unlinkSync(req.file.path);
});

module.exports = router;
