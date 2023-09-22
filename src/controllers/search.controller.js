const Course = require("../models/course.model");
const Blog = require("../models/blog.model");

const search = async (req, res) => {
  const { q, type } = req.query;
  let take;
  if (type === "less") {
    take = 5;
  } else if (type === "more") {
    take = 10;
  }
  // Tìm kiếm các khoá học có tiêu đề chứa chữ cái "q" (không phân biệt chữ hoa chữ thường)
  const courses = await Course.find({
    title: { $regex: new RegExp(q, "i") },
  })
    .limit(take)
    .populate({
      path: "chapters",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    });
  const blogs = await Blog.find({
    title: { $regex: new RegExp(q, "i") },
  }).limit(take);
  return res.status(200).json({ status: "OK", data: { courses, blogs } });
};

module.exports = {
  search,
};
