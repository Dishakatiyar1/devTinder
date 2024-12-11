const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dishakatiyar19424:Dishakatiyar19424@mycluster.etbjt.mongodb.net/devTinder"
  );
};

module.exports = connectDB;

// connectDB()
//   .then(() => {
//     console.log("Database connected successfullly!");
//   })
//   .catch((err) => {
//     console.log("database can not connect.");
//   });

// const URI =
//   "mongodb+srv://dishakatiyar19424:Dishakatiyar19424@mycluster.etbjt.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";
