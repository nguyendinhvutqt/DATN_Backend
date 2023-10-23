const express = require("express");
const router = express.Router();
const {
  getUsers,
  login,
  register,
  getCoursesLearned,
  refreshToken,
  blockUser,
  unBlockUser,
} = require("../../controllers/user.controller");
const {
  authUserMiddleware,
  authAdminMiddleware,
} = require("../../middlewares/auth");

// /api/v1/users
router.get("/", authAdminMiddleware, getUsers);

// /appi/v1/users/sign-in
router.post("/sign-in", login);

// /appi/v1/users/register
router.post("/sign-up", register);

// /appi/v1/users/course/learned
router.get("/course/learned", authUserMiddleware, getCoursesLearned);

// /api/v1/users/block
router.put("/block", authAdminMiddleware, blockUser);

// /api/v1/users/Un-block
router.put("/un-block", authAdminMiddleware, unBlockUser);

// /appi/v1/users/refresh-token
router.post("/refresh-token", refreshToken);

module.exports = router;
