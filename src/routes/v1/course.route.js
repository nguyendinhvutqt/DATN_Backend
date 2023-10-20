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
const {
  authUserMiddleware,
  authAdminMiddleware,
} = require("../../middlewares/auth");

const upload = multer({ storage: storage });

// /api/v1/coueses/
router
  .route("/")
  .get(getCourses)
  .post(authAdminMiddleware, upload.single("file"), addCourse);

// /api/v1/coueses/paginate
router.get("/paginate", getCoursesAndPaginate);

// /api/v1/coueses/:courseId
router
  .route("/:courseId")
  .get(getCourseById)
  .put(authAdminMiddleware, upload.single("file"), editCourse)
  .delete(authAdminMiddleware, delCourse);

// /api/v1/coueses/register-course
router.post("/register-course", authUserMiddleware, registerCourse);

module.exports = router;
