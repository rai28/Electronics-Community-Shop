const express = require("express");
const mongoose = require("mongoose");
// DB Config
const data = require("./data.js");
const db = require("./config/keys").mongoURI;
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

app.get("/api/products", (req, res) => {
  res.send(data.products);
});

userAuthApis(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on  http://localhost:${PORT}`);
});
