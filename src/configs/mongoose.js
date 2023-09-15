const mongoose = require("mongoose");

const connectMongoose = async (urlMongoose) => {
  try {
    await mongoose.connect(urlMongoose);
    console.log("Connect to mongoose success");
  } catch (error) {
    console.log("Connect to mongoose fail");
  }
};

module.exports = connectMongoose;
