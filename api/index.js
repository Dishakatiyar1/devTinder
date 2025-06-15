// api/index.js
const app = require("../src/app"); // your original Express app
const serverless = require("serverless-http"); // to convert Express to Vercel handler

module.exports = serverless(app);
