require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  paypalClientId: process.env.PAYPAL_CLIENT_ID,
};
