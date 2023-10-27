const ApiError = require("../ultils/ApiError");
const { StatusCodes } = require("http-status-codes");

const Blog = require("../models/blog.model");

const getBlogById = async (blogId) => {
  try {
    const blog = await Blog.findOne({ _id: blogId }).populate(
      "author",
      "name avatar"
    );
    if (!blog) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy bài viết");
    }
    return { data: blog };
  } catch (error) {
    throw error;
  }
};

const getBlogs = async (data) => {
  const { page, limit = 5 } = data;
  try {
    if (!page) {
      const blogs = await Blog.find({ status: "Đã duyệt" })
        .populate("author", "name avatar")
        .sort({
          createdAt: "desc",
        });

      if (!blogs) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy bài viết");
      }

      return {
        data: blogs,
      };
    } else {
      const skip = (page - 1) * limit;
      const totalBlogs = await Blog.count();
      const totalPage = Math.ceil(totalBlogs / limit);

      const blogs = await Blog.find()
        .sort({ status: "asc" })
        .limit(limit)
        .skip(skip);

      if (!blogs) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy bài viết");
      }

      return {
        currentPage: +page,
        totalPage: totalPage,
        data: blogs,
      };
    }
  } catch (error) {
    throw error;
  }
};

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

const confirmBlog = async (blogId) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      { _id: blogId },
      { status: "Đã duyệt" },
      { new: true }
    );
    return {
      message: "Duyệt bài viết thành công",
      data: blog,
    };
  } catch (error) {
    throw error;
  }
};

const delBlog = async (blogId) => {
  try {
    const deleteBlog = await Blog.findByIdAndDelete(blogId);
    return { data: deleteBlog, message: "Xoá bài viết thành công" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getBlogById,
  getBlogs,
  addBlog,
  confirmBlog,
  delBlog,
};
