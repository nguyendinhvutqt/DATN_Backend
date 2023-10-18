const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = require("../../middlewares/uploadFile");
const {
  addCourse,
  delCourse,
  getCourseById,
  getCourses,
  editCourse,
  registerCourse,
  getCoursesAndPaginate,
} = require("../../controllers/course.controller");
const { addChapter } = require("../../controllers/chapter.controller");
const courseValidation = require("../../validations/courseValidation");
const { authUserMiddleware } = require("../../middlewares/auth");

const upload = multer({ storage: storage });

// course
router
  .route("/")
  .get(authUserMiddleware, getCourses)
  .post(courseValidation.createCourse, upload.single("file"), addCourse);

router.get("/paginate", getCoursesAndPaginate);

router
  .route("/:courseId")
  .get(getCourseById)
  .put(courseValidation.editCourse, upload.single("file"), editCourse)
  .delete(delCourse);

// router.post("/add", upload.single("file"), addCourse);
// router.put("/edit/:id", upload.single("file"), editCourse);
// router.delete("/delete/:id", delCourse);
router.post("/register-course", registerCourse);

// chapter
router.post("/:courseId/chapter", addChapter);

module.exports = router;
