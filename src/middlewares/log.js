const User = require("../models/userModel");

const logDetails = async (req, res, userId) => {
  try {
    const user = await User.findById(userId, "-password");
    const userName = user ? user.name : "Guest";
    const logMessage = `User: ${userName}, Method: ${req.method}, Path: ${req.path}, Status: ${
      res.statusCode
    }, Time: ${new Date().toLocaleString()}`;
    console.log(logMessage);
  } catch (error) {
    console.error("Logging Error:", error);
  }
};

exports.logMiddleware = async (req, res, next) => {
  const id = req.params.id;

  // Asynchronous logging to avoid blocking
  logDetails(req, res, id)
    .then(() => next())
    .catch(next);
};
