const express = require("express");
const router = express.Router();
const {
  login,
  register,
  getCoursesLearned,
  refreshToken,
} = require("../../controllers/user.controller");
const { authUserMiddleware } = require("../../middlewares/auth");

router.post("/sign-in", login);
router.post("/sign-up", register);
router.get("/course/:id", authUserMiddleware, getCoursesLearned);
router.post("/refresh-token", refreshToken);

module.exports = router;
