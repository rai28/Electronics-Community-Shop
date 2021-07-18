const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// DB Config
const db = require("./config/keys").mongoURI;
// const JWT_SECRET = require("./config/keys").jwtSecret;
const User = require("./models/user");
const userAuthApis = require("./routes/userControllers/userAuthApis");
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

userAuthApis(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on  http://localhost:${PORT}`);
});
