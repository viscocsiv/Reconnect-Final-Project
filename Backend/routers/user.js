const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// patch bio
router.patch("/bio/:id", userController.changeBio);
// patch avatar
router.patch(
  "/avatar/:id",
  upload.single("avatar"),
  userController.changeAvatar
);
// patch username
router.patch("/username/:id", userController.changeUsername);

// get user by id
router.get("/:id", userController.getUserById);

module.exports = router;
