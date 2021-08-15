const mongoose = require("mongoose");
const UsersSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, default: "user" },
  },
  { collection: "users" }
);

const model = mongoose.model("UsersSchema", UsersSchema);
module.exports = model;
