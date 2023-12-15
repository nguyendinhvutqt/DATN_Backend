const express = require("express");

const courseRoute = require("./course.route");
const blogRoute = require("./blog.route");
const searchRoute = require("./search.route");
const userRoute = require("./user.route");
const chapterRoute = require("./chapter.route");
const lessonRouter = require("./lesson.route");
const commentRoute = require("./comment.route");
const paymentRoute = require("./payment.route");

const router = express.Router();

router.use("/courses", courseRoute);
router.use("/blogs", blogRoute);
router.use("/search", searchRoute);
router.use("/users", userRoute);
router.use("/chapters", chapterRoute);
router.use("/lessons", lessonRouter);
router.use("/comments", commentRoute);
router.use("/payment", paymentRoute);

module.exports = router;
