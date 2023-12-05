const express = require("express");
const router = express.Router();

const usersController = require("../controllers/userController");
const log = require("../middlewares/log");
const auth = require("../middlewares/auth");

// Routes
router.post("/user/login", log.logMiddleware, usersController.login);
router.post("/user/register", log.logMiddleware, usersController.register);
router.get("/user/:id", auth.required, log.logMiddleware, usersController.getUser);
router.get("/", log.logMiddleware, (req, res) => {
  try {
    return res.status(200).json({ msg: "Welcome to our API" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error on the Server! Try agian later!" });
  }
});

module.exports = router;
