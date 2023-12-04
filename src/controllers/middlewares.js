// Imports
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/userModel");

// Check Token Middleware
exports.checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Access denied" });
  }
  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(400).json({ msg: "Invalid Token" });
  }
};

// Log Middleware
exports.logMiddleware = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id, "-password");
  console.log("User:", user ? user.name : "Guest", "Path:", req.path, "Time:", new Date());
  next();
};
