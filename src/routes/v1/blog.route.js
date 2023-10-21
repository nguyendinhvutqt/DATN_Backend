const express = require("express");
const {
  addBlog,
  getBlogs,
  getBlogById,
  confirmBlog,
  delBlog,
} = require("../../controllers/blog.controller");
const {
  authUserMiddleware,
  authAdminMiddleware,
} = require("../../middlewares/auth");
const multer = require("multer");
const storage = require("../../middlewares/uploadFile");
const router = express.Router();

const upload = multer({ storage: storage });
// /api/v1/blogs/
router
  .route("/")
  .get(getBlogs)
  .post(authUserMiddleware, upload.single("file"), addBlog);

// /api/v1/blogs/:blogId
router
  .route("/:blogId")
  .get(getBlogById)

  .put(authAdminMiddleware, confirmBlog)
  .delete(authAdminMiddleware, delBlog);

module.exports = router;
