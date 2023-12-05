const express = require("express");
const router = express.Router();

const usersController = require("../controllers/userController");
const log = require("../middlewares/log");
const auth = require("../middlewares/auth");

// Routes
router.post("/user/login", log.logMiddleware, usersController.login);
router.post("/user/register", log.logMiddleware, usersController.register);
router.get("/user/:id", auth.required, log.logMiddleware, usersController.getUser);

module.exports = router;
