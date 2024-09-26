const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    `mongodb+srv://hotajagruti031:123Jagruti@cluster0.a7wfh.mongodb.net/Student`
  );
};

module.exports = connectDB;
