const express = require("express");
const router = express.Router();
const roomControllers = require("../controllers/roomControllers");

// router.get("/", roomControllers.listEvent);
// router.post("/create-event", roomControllers.createEvent);
router.get("/occasion/:id", roomControllers.joinRoom);
router.post("/create-message/:roomId", roomControllers.createMsg);
router.get("/list-message/:roomId", roomControllers.listMessage);

module.exports = router;
