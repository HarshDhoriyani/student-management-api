require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

async function seedAdmin() {
  const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required");
  }
  if (ADMIN_PASSWORD.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  }

  await mongoose.connect(MONGODB_URI);
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existingAdmin) {
    throw new Error("An account with ADMIN_EMAIL already exists; refusing to change its role");
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
  });
  console.info(`Administrator created: ${ADMIN_EMAIL.toLowerCase()}`);
}

seedAdmin()
  .catch((error) => {
    console.error("Failed to create administrator:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
