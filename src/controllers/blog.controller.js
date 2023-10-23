const { StatusCodes } = require("http-status-codes");
const blogService = require("../services/blogService");

const getBlogById = async (req, res, next) => {
  try {
    const result = await blogService.addBlog(req.params.blogId);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getBlogs = async (req, res, next) => {
  try {
    const result = await blogService.getBlogs(req.query);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const addBlog = async (req, res, next) => {
  try {
    const result = await blogService.addBlog(req.body, req.file, req.user);
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

const confirmBlog = async (req, res, next) => {
  try {
    const result = await blogService.confirmBlog(req.params.blogId);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const delBlog = async (req, res) => {
  try {
    const id = req.params.id;

    await Blog.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ status: "OK", message: "Xoá bài viết thành công" });
  } catch (error) {
    return res
      .status(200)
      .json({ status: "OK", message: "Xoá bài viết thất bại" });
  }
};

module.exports = {
  getBlogById,
  getBlogs,
  addBlog,
  confirmBlog,
  delBlog,
};
