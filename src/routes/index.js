const courseRoute = require("./course.route");
const blogRoute = require("./blog.route");
const searchRoute = require("./search.route");
const userRoute = require("./user.route");
const chapterRoute = require("./chapter.route");
const lessonRouter = require("./lesson.route");
const commentRouter = require("./comment.route");

const routes = (app) => {
  app.use("/api/courses", courseRoute);
  app.use("/api/blogs", blogRoute);
  app.use("/api/search", searchRoute);
  app.use("/api/users", userRoute);
  app.use("/api/chapters", chapterRoute);
  app.use("/api/lessons", lessonRouter);
  app.use("/api/comments", commentRouter);
};

module.exports = routes;
