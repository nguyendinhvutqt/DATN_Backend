const { StatusCodes } = require("http-status-codes");
const blogService = require("../services/blogService");

const getBlogById = async (req, res, next) => {
  try {
    const result = await blogService.getBlogById(req.params.blogId);
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

const delBlog = async (req, res, next) => {
  try {
    const result = await blogService.delBlog(req.params.blogId);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogById,
  getBlogs,
  addBlog,
  confirmBlog,
  delBlog,
};
