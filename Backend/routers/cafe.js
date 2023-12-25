const express = require("express");
const router = express.Router();
const cafeController = require("../controllers/cafeController");

const multer = require("multer");
const onlyOwner = require("../middlewares/authorization");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// get cafe by user location
router.get("/", cafeController.getCafeByUserLocation);
// patch photo
router.patch(
  "/change-photo/:id",
  onlyOwner,
  upload.single("photo"),
  cafeController.changePhoto
);
// patch description
router.patch(
  "/description/:id",
  onlyOwner,
  cafeController.changeDescription
);
// patch name
router.patch(
  "/name/:id",
  onlyOwner,
  cafeController.changeName
);
// patch address
router.patch(
  "/address/:id",
  onlyOwner,
  cafeController.changeAddress
);
// post photo in gallery
router.post(
  "/gallery/:CafeId",
  onlyOwner,
  upload.single("imgUrl"),
  cafeController.postGallery
);
// delete photo from gallery
router.delete(
  "/gallery/:id",
  onlyOwner,
  cafeController.deletePhotoGallery
);

// get cafe by id
router.get("/:id", cafeController.getCafeById);

module.exports = router;
