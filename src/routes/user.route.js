const express = require("express");
const router = express.Router();
const {
  login,
  register,
  getCoursesByUserId,
} = require("../controllers/user.controller");

router.post("/sign-in", login);
router.post("/sign-up", register);
router.get("/course/:id", getCoursesByUserId);

module.exports = router;
