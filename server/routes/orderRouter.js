const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const isAuth = require("../middlewares/isAuth");
const Order = require("../models/orderModel");
const orderRouter = express.Router();

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // check for order errors
    if (req.body.orderItems.length === 0) {
      res.status(400).send("No order found");
    } else {
      // create order
      const order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: "Order created successfully", order: createdOrder });
    }
  })
);

module.exports = orderRouter;
