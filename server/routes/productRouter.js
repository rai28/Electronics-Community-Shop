const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const data = require("../data.js");

const productRouter = express.Router();

// GET /api/products to send products data to the client
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    let products = await productModel.find({});
    res.send(products);
  })
);

// GET /api/products/:id to send a product data to the client

productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // await productModel.remove({}); // Remove all existing data
    const createProducts = await productModel.insertMany(data.products);
    res.send({ createProducts });
  })
);

module.exports = productRouter;

// GET /api/products/:id to send a product data to the client

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await productModel.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      // send a 404 - Not Found error and message to the client
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
