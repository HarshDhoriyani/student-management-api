const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const asyncHandler = require("../middleware/asyncHandler");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const schemas = require("../validation/schemas");

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many authentication attempts; try again later" },
});

router.post("/register", authLimiter, validate(schemas.register), asyncHandler(authController.register));
router.post("/login", authLimiter, validate(schemas.login), asyncHandler(authController.login));
router.get("/me", authenticate, asyncHandler(authController.me));

module.exports = router;
