const ApiError = require("../ultils/ApiError");
const { StatusCodes } = require("http-status-codes");

const Blog = require("../models/blog.model");

const addBlog = async (data, file, userInfo) => {
  try {
    const { title, content } = data;
    if (!title || !content || !file) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Thông tin không được bỏ trống"
      );
    }
    await Blog.create({
      title,
      content,
      thumbnail: `/images/${file.filename}`,
      author: userInfo.userId,
    });
    return { message: "Tạo bài viết thành công, vui lòng chờ duyệt" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addBlog,
};
