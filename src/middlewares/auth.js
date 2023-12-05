// Imports
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.required = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.SECRET);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Auth Fail" });
  }
};
