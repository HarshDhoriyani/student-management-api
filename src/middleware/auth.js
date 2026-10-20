const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  let payload;
  try {
    payload = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    return res.status(401).json({ error: "User account no longer exists" });
  }

  req.user = user;
  next();
});

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Administrator access required" });
  }
  next();
}

module.exports = { authenticate, requireAdmin };
