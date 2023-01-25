const mongoose = require("mongoose");

const mogoose = require("mongoose");

mongoose.set("strictQuery", false);
const connectDB = (url) => mongoose.connect(url);

module.exports = connectDB;
