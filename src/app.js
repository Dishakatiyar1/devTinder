const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  // creating a new instance of the user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully!!");
  } catch (err) {
    res.status(400).send("Error saving the user:", err.message);
  }
});

// get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(400).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await user.findByIdAndDelete({ _id: userId });
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully.");
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
    });
    console.log(user);
    res.send("User updated successfully.");
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfullly!");
    app.listen(8000, () => {
      console.log("server listening to the port 8000");
    });
  })
  .catch((err) => {
    console.log("database can not connect.");
  });
