const mongoose = require("mongoose");

const connectMongoose = async (urlMongoose) => {
  try {
    await mongoose.connect(urlMongoose),
      { useNewUrlParser: true, useUnifiedTopology: true };
    console.log("Connect to mongoose success!!");
  } catch (error) {
    console.log("Connect to mongoose fail: ", error);
  }
};

module.exports = connectMongoose;
