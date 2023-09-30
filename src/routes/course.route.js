const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = require("../middlewares/uploadFile");
const {
  addCourse,
  delCourse,
  getCourseById,
  getCourses,
  editCourse,
  registerCourse,
  getCoursesAndPaginate,
} = require("../controllers/course.controller");
const { addChapter } = require("../controllers/chapter.controller");

const upload = multer({ storage: storage });

// course
router.get("/", getCourses);
router.get("/paginate", getCoursesAndPaginate);
router.get("/:id", getCourseById);
router.post("/add", upload.single("file"), addCourse);
router.put("/edit/:id", upload.single("file"), editCourse);
router.delete("/delete/:id", delCourse);
router.post("/register-course", registerCourse);

// chapter
router.post("/:courseId/chapter", addChapter);
router.get("/:courseId/:chapterId", (req, res) => {
  res.send("éd");
});

module.exports = router;
