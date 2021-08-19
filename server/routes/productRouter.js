const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const data = require("../data.js");

const productRouter = express.Router();

productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const createProducts = await productModel.insertMany(data.products);
    res.send({ createProducts });
  })
);

module.exports = productRouter;
