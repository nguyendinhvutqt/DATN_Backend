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
} = require("../controllers/course.controller");

const upload = multer({ storage: storage });

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/add", upload.single("file"), addCourse);
router.put("/edit/:id", editCourse);
router.delete("/delete/:id", delCourse);

module.exports = router;
