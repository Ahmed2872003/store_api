require("express-async-errors");
require("dotenv").config();

const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

const productsRouter = require("./routes/products.js");

const notFoundMiddleware = require("./middleware/not-found.js");

const errorHandlerMiddleware = require("./middleware/error-handler.js");

const connectDB = require("./db/connect.js");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/v1/products", productsRouter);

// routes
app.get("/", (req, res) => {
  res.send(`<h1>Store API</h1>
  <a href="/api/v1/products">Products route</a>`);
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
// connectDB
const start = async () => {
  await connectDB(process.env.MONGO_URI);
  console.log("Connected to the database");
  app.listen(port, () => console.log(`API is listening on port: ${port}...`));
};

start();
