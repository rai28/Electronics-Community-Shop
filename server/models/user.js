const mongoose = require("mongoose");
const UsersSchema = new mongoose.Schema(
  {
    // username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // firstName: { type: String, required: true },
    // lastName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

const model = mongoose.model("UsersSchema", UsersSchema);
module.exports = model;
