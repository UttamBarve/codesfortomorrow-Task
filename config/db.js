const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("DATABASE CONNECTED");
  } catch (err) {
    console.log("DATABASE NOT CONNECTED: ", err);
  }
};

module.exports = connectDB;
