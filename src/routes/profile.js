const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    // res.send(user);
    res.status(200).json({ key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(400).send("ERROR: " + "Invalid token");
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key])); // update
    await loggedInUser.save(); // save update

    res.json({
      message: "Profile update successfully!",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// my code
profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { password } = req.body;

    if (!password) {
      throw new Error("Password is required!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    loggedInUser.password = hashedPassword; // update password
    await loggedInUser.save(); // save
    res.json({ message: "Password updated successfully!", data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
