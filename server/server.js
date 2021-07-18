const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// DB Config
const db = require("./config/keys").mongoURI;
const JWT_SECRET = require("./config/keys").jwtSecret;
const User = require("./models/user");
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Failed to connect to DB");
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/change-password", (req, res) => {
  res.sendFile(__dirname + "/changePassword.html");
});

//post request for registration
app.post("/api/register", async (req, res) => {
  const { email, password: plainTextPassword } = req.body;
  if (!email || typeof email !== "string") {
    return res.json({ status: "error", error: "Invalid email" });
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
      email,
      password,
    });
    console.log("User created success !!", resp);
  } catch (err) {
    if (err.code === 11000) {
      // duplicate key error
      res.status(400);
      return res.json({ status: 400, err: "Email already in use" });
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
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
  res.json({ status: "ok", data: token });
});

// change password post request
app.post("/api/change-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || typeof token !== "string") {
      return res.json({ status: "error", error: "Invalid token" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.json({ status: "error", error: "Invalid token" });
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
    res.json({ status: "error", error: "Invalid token" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on  http://localhost:${PORT}`);
});
