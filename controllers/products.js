const { query } = require("express");
const product = require("../models/product.js");
const { parse } = require("dotenv");

const getAllProducts = async (req, res) => {
  const {
    featured,
    company,
    name,
    sort = "",
    fields = "",
    numericFilters = "",
  } = req.query;
  const queryObj = {};
  // filter by properties
  if (featured) queryObj.featured = featured;
  if (company) queryObj.company = { $regex: company, $options: "i" };
  if (name) queryObj.name = { $regex: name, $options: "i" };
  if (numericFilters) {
    const operatorToquery = {
      ">": "$gt",
      "<": "$lt",
      ">=": "$gte",
      "<=": "$lte",
      "=": "$eq",
      "!=": "$ne",
    };
    const options = ["price", "rating"];

    numericFilters
      .replace(/(>=?|<=?|!?=)|\s+/g, (match) =>
        match.includes(" ") ? "" : ` ${operatorToquery[match]} `
      )
      .split(",")
      .forEach((filter) => {
        const [field, operator, value] = filter.split(" ");
        if (options.includes(field))
          queryObj[field] = { [operator]: Number(value) };
      });
  }
  // distribute in pages
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  let products = await product
    .find(queryObj)
    .sort(sort.replaceAll(",", " ") || "-createdAt -_id")
    .select(fields.replaceAll(",", " "))
    .skip(skip)
    .limit(limit);

  res.status(200).json({ products, nHits: products.length });
};

module.exports = {
  getAllProducts,
};
