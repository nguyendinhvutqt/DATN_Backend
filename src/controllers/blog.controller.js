const Blog = require("../models/blog.model");

const getBlogById = async (req, res) => {
  try {
    const id = req.params.id;

    const blog = await Blog.findOne({ _id: id });
    if (!blog) {
      return res
        .status(401)
        .json({ status: "ERR", message: "Không tìm thấy bài viết" });
    }
    return res.status(200).json({ status: "OK", data: blog });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "ERR", message: "Không tìm thấy bài viết" });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().limit(10);
    if (!blogs) {
      return res
        .status(401)
        .json({ status: "ERR", message: "Không tìm thấy bài viết" });
    }
    return res.status(200).json({ status: "OK", data: blogs });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "ERR", message: "Không tìm thấy bài viết" });
  }
};

const addBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(401)
        .json({ status: "ERR", message: "Thông tin không được để trống" });
    }
    await Blog.create({
      ...req.body,
    });
    return res
      .status(201)
      .json({ status: "OK", message: "Tạo bài viết thành công" });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "ERR", message: "Tạo bài viết thất bại" });
  }
};

const confirmBlog = async (req, res) => {
  try {
    const id = req.params.id;

    await Blog.findByIdAndUpdate({ _id: id }, { status: true }, { new: true });
    return res
      .status(200)
      .json({ status: "OK", message: "Duyệt bài viết thành công" });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "ERR", message: "Duyệt bài viết thất bại" });
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
