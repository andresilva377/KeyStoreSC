// Imports
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/userModel");

// Login logic
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validations
  if (!email) {
    return res.status(422).json({ msg: "Email is mandatory!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Password is mandatory!" });
  }

  // Check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Invalid email!" });
  }

  // Check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Invalid password!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
      { expiresIn: "5m" }
    );

    return res.status(200).json({ msg: "Authentication completed successfully!", token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error on the Server! Try agian later!" });
  }
};

// Register logic
exports.register = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  // Validations
  if (!name) {
    return res.status(422).json({ msg: "Name is mandatory!" });
  }

  if (!email) {
    return res.status(422).json({ msg: "Email is mandatory!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Password is mandatory!" });
  }

  if (password !== confirmpassword) {
    return res.status(422).json({ msg: "Passwords don't match!" });
  }

  if (!/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {
    return res.status(422).json({ msg: "Invalid Email!" });
  }

  // Check if user exists
  const userExist = await User.findOne({ email: email });

  if (userExist) {
    return res.status(422).json({ msg: "Email already in use. Please user another email!" });
  }

  // Verify password
  if (password.length < 8) {
    return res.status(422).json({ msg: "Password is to short!" });
  } else if (!/[A-Z]/.test(password)) {
    return res.status(422).json({ msg: "Password must have a upper case character!" });
  } else if (!/[0-9]/.test(password)) {
    return res.status(422).json({ msg: "Password must have a number!" });
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(422).json({ msg: "Password must have a special character!" });
  }

  // Create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // create user
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();

    return res.status(201).json({ msg: "User created with success!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error on the Server! Try agian later!" });
  }
};

exports.getUser = async (req, res) => {
  try {
    // req.params
    let id = req.params.id;

    // Check if user exists
    const user = await User.findById(id, "-password");

    if (!user) {
      return res.status(404).send({ success: 0, message: "User not found!" });
    }

    // Build response
    let response = {
      success: 1,
      length: user.length,
      results: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };

    // Send response
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};
