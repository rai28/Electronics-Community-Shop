const express = require("express");
const mongoose = require("mongoose");
// DB Config
// const data = require("./data.js");
const productRouter = require("./routes/productRouter.js");
const userRouter = require("./routes/userControllers/userRetrive.js");
const orderRouter = require("./routes/orderRouter.js");
const db = require("./config/keys").mongoURI;
const paypalClientId = require("./config/keys").paypalClientId;
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

app.use("api/login", userAuthApis);

app.get("/change-password", (req, res) => {
  res.sendFile(__dirname + "/changePassword.html");
});

app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/user", userRouter);

app.get("/api/config/paypal", (req, res) => {
  res.send(paypalClientId);
});
userAuthApis(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on  http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});
