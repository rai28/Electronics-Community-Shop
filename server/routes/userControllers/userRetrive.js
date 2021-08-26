const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const User = require("../../models/user");
const userRetrive = express.Router();
const bcrypt = require("bcryptjs");
const generateToken = require("../../middlewares/jwtVerify");
const isAuth = require("../../middlewares/isAuth");

userRetrive.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json(user);
  })
);

userRetrive.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.name = req.body.userName || user.userName;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await user.save();
    res.send({
      id: updatedUser._id,
      name: updatedUser.userName,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      data: generateToken(updatedUser),
    });
  })
);

module.exports = userRetrive;
