const product = require("../models/product.js");

const getAllProductsStatic = async (req, res) => {
  const products = await product
    .find({})
    .sort("name")
    .select("price name")
    .limit("5")
    .skip("5");
  res.status(200).json({ products, nHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort = "", fields = "" } = req.query;
  const queryObj = {};
  // filter by properties
  if (featured) queryObj.featured = featured;
  if (company) queryObj.company = { $regex: company, $options: "i" };
  if (name) queryObj.name = { $regex: name, $options: "i" };

  // distribute in pages
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  let products = await product
    .find(queryObj)
    .sort(sort.replaceAll(",", " ") || "-createdAt")
    .select(fields.replaceAll(",", " "))
    .skip(skip)
    .limit(limit);

  res.status(200).json({ products, nHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
