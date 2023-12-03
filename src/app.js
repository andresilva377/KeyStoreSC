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
app.use(logMiddleware);

// Routes
app.use("/user", require("./routes/user.Routes"));

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
const User = require("./models/userModel");

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

// Register User
// app.post("/auth/register", async (req, res) => {
//   const { name, email, password, confirmpassword } = req.body;

//   // Validations
//   if (!name) {
//     return res.status(422).json({ msg: "Name is mandatory!" });
//   }

//   if (!email) {
//     return res.status(422).json({ msg: "Email is mandatory!" });
//   }

//   if (!password) {
//     return res.status(422).json({ msg: "Password is mandatory!" });
//   }

//   if (password !== confirmpassword) {
//     return res.status(422).json({ msg: "Passwords don't match!" });
//   }

//   if (!/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {
//     return res.status(422).json({ msg: "Invalid Email!" });
//   }

//   // Check if user exists
//   const userExist = await User.findOne({ email: email });

//   if (userExist) {
//     return res.status(422).json({ msg: "Email already in use. Please user another email!" });
//   }

//   // Verify password
//   if (password.length < 8) {
//     return res.status(422).json({ msg: "Password is to short!" });
//   } else if (!/[A-Z]/.test(password)) {
//     return res.status(422).json({ msg: "Password must have a upper case character!" });
//   } else if (!/[0-9]/.test(password)) {
//     return res.status(422).json({ msg: "Password must have a number!" });
//   } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
//     return res.status(422).json({ msg: "Password must have a special character!" });
//   }

//   // Create password
//   const salt = await bcrypt.genSalt(12);
//   const passwordHash = await bcrypt.hash(password, salt);

//   // create user
//   const user = new User({
//     name,
//     email,
//     password: passwordHash,
//   });

//   try {
//     await user.save();

//     res.status(201).json({ msg: "User created with success!" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ msg: "Error on the Server! Try agian later!" });
//   }
// });

// // Login User
// app.post("/auth/login", async (req, res) => {
//   const { email, password } = req.body;

//   // Validations
//   if (!email) {
//     return res.status(422).json({ msg: "Email is mandatory!" });
//   }

//   if (!password) {
//     return res.status(422).json({ msg: "Password is mandatory!" });
//   }

//   // Check if user exists
//   const user = await User.findOne({ email: email });

//   if (!user) {
//     return res.status(404).json({ msg: "Invalid email!" });
//   }

//   // Check if password match
//   const checkPassword = await bcrypt.compare(password, user.password);

//   if (!checkPassword) {
//     return res.status(422).json({ msg: "Invalid password!" });
//   }

//   try {
//     const secret = process.env.SECRET;

//     const token = jwt.sign(
//       {
//         id: user._id,
//       },
//       secret,
//       { expiresIn: "5m" }
//     );

//     res.status(200).json({ msg: "Authentication completed successfully!", token });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ msg: "Error on the Server! Try agian later!" });
//   }
// });
