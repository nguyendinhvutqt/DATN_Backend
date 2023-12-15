const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

// /appi/v1/config
router.get("/config", (req, res) => {
  return res.status(StatusCodes.OK).json({
    status: "OK",
    data: process.env.CLIENT_ID,
  });
});

module.exports = router;
