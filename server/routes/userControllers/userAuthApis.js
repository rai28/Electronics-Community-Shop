const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// DB Config
const JWT_SECRET = require("../../config/keys").jwtSecret;
const User = require("../../models/user");
const generateToken = require("../../middlewares/jwtVerify");
const app = express();

//user authentication post routes apis
module.exports = function (app) {
  //post request for registration
  app.post("/api/register", async (req, res) => {
    const { userName, email, password: plainTextPassword } = req.body;
    if (!email || typeof email !== "string") {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email" });
    }

    if (!userName || typeof userName !== "string") {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid username" });
    }

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid password" });
    }

    if (plainTextPassword.length < 6) {
      return res
        .status(401)
        .json({ status: "error", message: "Password too short" });
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
      var createdUser = await User.create({
        userName,
        email,
        password,
      });
      console.log("User created success !!", createdUser);
    } catch (error) {
      if (error.code === 11000) {
        // duplicate key error
        res.status(400);
        return res.json({ status: 400, message: "Email already in use" });
      }
      throw error;
    }

    // res.json({ status: "ok" });

    const authToken = generateToken(createdUser);
    res.json({ status: "ok", data: authToken, userName: createdUser.userName });
  });

  // login post request
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || typeof email !== "string") {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email" });
    }
    if (!password || typeof password !== "string") {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // send status code 401 for unauthorized
      return res
        .status(401)
        .json({ status: "error", message: "Invalid password" });
    }
    const userName = user.userName;
    const authToken = generateToken(user);
    res.json({
      status: "ok",
      data: authToken,
      userName: userName,
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  });

  // change password post request
  app.post("/api/change-password", async (req, res) => {
    try {
      const { authToken, newPassword } = req.body;
      if (!authToken || typeof authToken !== "string") {
        return res
          .status(401)
          .json({ status: "error", message: "Invalid authToken" });
      }
      const decoded = jwt.verify(authToken, JWT_SECRET);
      if (!decoded) {
        return res
          .status(401)
          .json({ status: "error", message: "Invalid authToken" });
      }
      const user = await User.findById(decoded.id);
      if (!user) {
        return res
          .status(401)
          .json({ status: "error", message: "User not found" });
      }
      if (!newPassword || typeof newPassword !== "string") {
        return res
          .status(401)
          .json({ status: "error", message: "Invalid password" });
      }
      if (newPassword.length < 6) {
        return res
          .status(401)
          .json({ status: "error", message: "Password too short" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updateOne({ _id: decoded.id }, { password: hashedPassword });
      res.json({ status: "ok" });
    } catch (err) {
      res.json({ status: "error", message: "Invalid authToken" });
    }
  });
};
