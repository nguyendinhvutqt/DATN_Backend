const express = require("express");
const router = express.Router();
const { search } = require("../../controllers/search.controller");

// /appi/v1/search
router.get("/", search);

module.exports = router;
