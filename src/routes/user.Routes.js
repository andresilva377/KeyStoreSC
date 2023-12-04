const router = require("express").Router();
const userController = require("../controllers/userController");
const middlewares = require("../controllers/middlewares");

const User = require("../models/userModel");

// Routes
router.route("/login").post(middlewares.logMiddleware, userController.login);
router.route("/register").post(middlewares.logMiddleware, userController.register);
router.route("/:id").get(middlewares.logMiddleware, middlewares.checkToken, async (req, res) => {
  const id = req.params.id;

  // Check if user exists
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "User not found!" });
  }

  res.status(200).json({ user });
});

module.exports = router;
