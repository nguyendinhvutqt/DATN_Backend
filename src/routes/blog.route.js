const express = require("express");
const {
  addBlog,
  getBlogs,
  getBlogById,
  confirmBlog,
  delBlog,
} = require("../controllers/blog.controller");
const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/add", addBlog);
router.put("/edit/:id", confirmBlog);
router.delete("/delete/:id", delBlog);

module.exports = router;
