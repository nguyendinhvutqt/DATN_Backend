const multer = require("multer");
const appRoot = require("app-root-path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + "/src/public/images");
  },
  filename: function (req, file, cb) {
    console.log("file", file);
    cb(null, Date.now() + file.originalname);
  },
});

module.exports = storage;
