const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      secure: true,
      sameSite: "None",
    });
    res.json({ message: "User added successfully!!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        secure: false,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        httpOnly: true,
      });

      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(0),
  });
  res.send("Logout successful!");
});
module.exports = authRouter;
