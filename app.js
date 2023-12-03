// Imports
require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); /////////////
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
// Config JSON response
app.use(express.json());
//app.use(logMiddleware);
app.use("/", express.static(path.join(__dirname, "static")));

// Routes
app.use("/user", require("./src/routes/user.Routes"));

// Credencials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.elzyrqf.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(3000);
    console.log("Connected to Database!");
  })
  .catch((err) => console.log(err));

// Models
const User = require("./src/models/userModel");

/////////////////////////////////////////////////////////////////////

// Open Route - Public Route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome to our API!" });
});

// Private Route
app.get("/user/:id", logMiddleware, checkToken, async (req, res) => {
  const id = req.params.id;

  // Check if user exists
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "User not found!" });
  }

  res.status(200).json({ user });
});

// Check Token Middleware
function checkToken(req, res, next) {
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
}

// Log Middleware
async function logMiddleware(req, res, next) {
  const id = req.params.id;
  const user = await User.findById(id, "-password");
  console.log("User:", user ? user.name : "Guest", "Path:", req.path, "Time:", new Date());
  next();
}
