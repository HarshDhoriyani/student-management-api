const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createAccessToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function register(req, res) {
  const user = await User.create(req.validated.body);
  res.status(201).json({
    user: publicUser(user),
    accessToken: createAccessToken(user),
    tokenType: "Bearer",
  });
}

async function login(req, res) {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({
    user: publicUser(user),
    accessToken: createAccessToken(user),
    tokenType: "Bearer",
  });
}

function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

module.exports = { register, login, me };
