const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register/user", authController.registerUser);
router.post("/register/owner", authController.registerOwner);

module.exports = router;
