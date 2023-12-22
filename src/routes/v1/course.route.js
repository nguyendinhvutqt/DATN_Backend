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

module.exports = router;
