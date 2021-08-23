const mongoose = require("mongoose");
const UsersSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false, required: true },
  },
  { collection: "users" },
  { timestamps: true }
);

const User = mongoose.model("User", UsersSchema);
module.exports = User;
