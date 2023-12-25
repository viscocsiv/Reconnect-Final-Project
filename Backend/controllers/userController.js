const { User, Room, Occasion } = require("../models");
const { convertToURI, getFileName } = require("../helpers/uploadUtils");
const cloudinary = require("cloudinary").v2;

class userController {
  static async getUserById(req, res, next) {
    try {
      let { id } = req.params;
      let data = await User.findByPk(id, {
        attributes: ["id", "email", "username", "role", "avatar", "bio"],
        include: [
          {
            required: false,
            model: Room,
            include: [{ required: false, model: Occasion }],
          },
        ],
      });

      if (!data) {
        throw { name: "notFound", id };
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async changeBio(req, res, next) {
    try {
      let { bio } = req.body;
      let { id } = req.params;
      let user = await User.findByPk(id);
      if (!user) {
        throw { name: "notFound", id };
      }
      let data = await User.update({ bio }, { where: { id }, returning: true });
      res.status(200).json({ message: "User bio updated" });
    } catch (error) {
      next(error);
    }
  }
  static async changeAvatar(req, res, next) {
    try {
      console.log("aaaaaaaaaaaaaa");
      if (!req.file) {
        throw { name: "noFile" };
      }
      let { id } = req.params;
      let user = await User.findByPk(id);
      if (!user) {
        throw { name: "notFound", id };
      }
      let dataURI = convertToURI(req.file);
      let fileName = getFileName(req.file);
      let uploaded = await cloudinary.uploader.upload(dataURI, {
        public_id: fileName,
        folder: "reconnect",
      });
      await User.update({ avatar: uploaded.url }, { where: { id } });
      res.status(200).json({ message: "User avatar updated" });
    } catch (error) {
      next(error);
    }
  }
  static async changeUsername(req, res, next) {
    try {
      let { username } = req.body;
      let { id } = req.params;
      let user = await User.findByPk(id);
      if (!user) {
        throw { name: "notFound", id };
      }
      let data = await User.update(
        { username },
        { where: { id }, returning: true }
      );
      res.status(200).json({ message: "User username updated" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;
