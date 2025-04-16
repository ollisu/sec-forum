const mongoose = require("mongoose");
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB using Mongoose!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

module.exports = { connectToDatabase };
