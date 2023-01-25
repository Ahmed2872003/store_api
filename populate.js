require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./db/connect.js");

const productModel = require("./models/product.js");

const products = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to the database");
    await productModel.deleteMany();
    console.log("All data in the database are deleted");
    await productModel.create(products);
    console.log("database are initiated with data");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
