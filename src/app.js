const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Prashant",
    lastName: "Badal",
    emailId: "prashantbadal@gmail.com",
    password: "Prashant@123",
  };
  // creating a new instance of the user model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User added successfully!!");
  } catch (err) {
    res.status(400).send("Error saving the user:", err.message);
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
