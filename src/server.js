require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const port = Number(process.env.PORT) || 3000;

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters");
  }

  await connectDatabase();
  const server = app.listen(port, () => {
    console.info(`Student Management API listening on port ${port}`);
  });

  const shutdown = (signal) => {
    console.info(`${signal} received; shutting down`);
    server.close(() => {
      const mongoose = require("mongoose");
      mongoose.disconnect().then(() => process.exit(0));
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((error) => {
  console.error("Failed to start Student Management API:", error);
  process.exit(1);
});
