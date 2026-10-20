const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const corsOrigin = process.env.CORS_ORIGIN;

app.disable("x-powered-by");
app.use(helmet());
if (corsOrigin) {
  app.use(cors({ origin: corsOrigin.split(",").map((origin) => origin.trim()) }));
}
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
