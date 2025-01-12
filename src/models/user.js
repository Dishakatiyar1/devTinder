const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
  about: {
    type: String,
    default: "This is the default about of the user!",
  },
  skills: {
    type: [String],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
