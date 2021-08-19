const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    category: { type: String, required: true, default: "General" },
    image: { type: String, required: true },
    isDonation: { type: Boolean, required: true, default: false },
    isBarter: { type: Boolean, required: true, default: false },
    onSale: { type: Boolean, required: true, default: false },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", ProductSchema);
module.exports = productModel;
