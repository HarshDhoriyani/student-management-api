const mongoose = require("mongoose");

async function connectDatabase() {
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(MONGODB_URI);
  console.info("Connected to MongoDB");
}

module.exports = connectDatabase;
