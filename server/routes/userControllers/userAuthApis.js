const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// DB Config
const JWT_SECRET = require("../../config/keys").jwtSecret;
const User = require("../../models/user");
const app = express();

//user authentication post routes apis
module.exports = function (app) {
  //post request for registration
  app.post("/api/register", async (req, res) => {
    const { userName, email, password: plainTextPassword } = req.body;
    if (!email || typeof email !== "string") {
      return res.json({ status: "error", error: "Invalid email" });
    }

    if (!userName || typeof userName !== "string") {
      return res.json({ status: "error", error: "Invalid username" });
    }

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
    }

    if (plainTextPassword.length < 6) {
      return res.json({ status: "error", error: "Password too short" });
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
      const resp = await User.create({
        userName,
        email,
        password,
      });
      console.log("User created success !!", resp);
    } catch (error) {
      if (error.code === 11000) {
        // duplicate key error
        res.status(400);
        return res.json({ status: 400, error: "Email already in use" });
      }
      throw err;
    }

    res.json({ status: "ok" });
  });

  // login post request
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || typeof email !== "string") {
      return res.json({ status: "error", error: "Invalid email" });
    }
    if (!password || typeof password !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: "error", error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ status: "error", error: "Invalid password" });
    }
    const userName = user.userName;
    const authToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
    res.json({ status: "ok", data: authToken, userName: userName });
  });

  // change password post request
  app.post("/api/change-password", async (req, res) => {
    try {
      const { authToken, newPassword } = req.body;
      if (!authToken || typeof authToken !== "string") {
        return res.json({ status: "error", error: "Invalid authToken" });
      }
      const decoded = jwt.verify(authToken, JWT_SECRET);
      if (!decoded) {
        return res.json({ status: "error", error: "Invalid authToken" });
      }
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.json({ status: "error", error: "User not found" });
      }
      if (!newPassword || typeof newPassword !== "string") {
        return res.json({ status: "error", error: "Invalid password" });
      }
      if (newPassword.length < 6) {
        return res.json({ status: "error", error: "Password too short" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updateOne({ _id: decoded.id }, { password: hashedPassword });
      res.json({ status: "ok" });
    } catch (err) {
      res.json({ status: "error", error: "Invalid authToken" });
    }
  });
};
