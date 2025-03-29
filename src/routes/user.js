const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully!",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" }, // request sent by someone else to me
        { fromUserId: loggedInUser._id, status: "accepted" }, // request sent by me to someone, now both are my connections
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"]) // mongodb allows to connect models like sql
      .populate("toUserId", ["firstName", "lastName"]);

    // convert data to array of objects having first, last name and _id only
    const data = connectionRequests?.map((row) => {
      // if request send by me then return toUserId details otherwise fromUserId details
      if (row.fromUserId?._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Data fetched successfully!",
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
