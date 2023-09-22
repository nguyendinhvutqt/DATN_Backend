const express = require("express");
const { getById, learnedLession } = require("../controllers/lesson.controller");
const router = express.Router();

router.get("/:id", getById);
router.post("/learned", learnedLession);

module.exports = router;
