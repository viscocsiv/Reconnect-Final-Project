const express = require("express");
const router = express.Router();
const occasionController = require("../controllers/occasionController");

const multer = require("multer");
const onlyOwner = require("../middlewares/authorization");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// post create occasion
router.post(
  "/",
  onlyOwner,
  upload.single("photo"),
  occasionController.createOccasion
);
// patch photo
router.patch(
  "/change-photo/:id",
  onlyOwner,
  upload.single("photo"),
  occasionController.changePhoto
);
// patch description
router.patch(
  "/description/:id",
  onlyOwner,
  occasionController.changeDescription
);
// patch eventName
router.patch(
  "/eventName/:id",
  onlyOwner,
  occasionController.changeEventName
);
// patch startTime
router.patch(
  "/startTime/:id",
  onlyOwner,
  occasionController.changeStartTime
);
// patch address
router.patch(
  "/endTime/:id",
  onlyOwner,
  occasionController.changeEndTime
);
router.get("/", occasionController.getOccasionByUserLocation);
router.get("/:id", occasionController.getOccasionById);
module.exports = router;
