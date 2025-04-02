const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");
dotenv.config();

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      res.status(401).send("Please login!");
      return;
    }
    const decodedObj = await jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const { _id } = decodedObj;
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("User not found!");
    }
    req.user = user; // ***Note: Add user to the req object which is passed to request handler***
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
