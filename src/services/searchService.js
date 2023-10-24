const Course = require("../models/course.model");
const Blog = require("../models/blog.model");

const searchService = async (q, type) => {
  try {
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
      status: "Đã duyệt",
    }).limit(take);
    return { data: { courses, blogs } };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  searchService,
};
