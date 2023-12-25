const { User, Gallery, Occasion, Cafe, sequelize } = require("../models");
const { convertToURI, getFileName } = require("../helpers/uploadUtils");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class cafeController {
  static async getCafeById(req, res, next) {
    try {
      let { id } = req.params;
      let data = await Cafe.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["id", "email", "username", "role", "avatar", "bio"],
          },
          {
            model: Gallery,
            required: false,
          },
          {
            model: Occasion,
            required: false,
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
  static async getCafeByUserLocation(req, res, next) {
    try {
      const distance = 5000;
      const long = req.query.longitude;
      const lat = req.query.latitude;
      if (!long || !lat) {
        throw { name: "noUserLocation" };
      }
      const result = await sequelize.query(
        `select *
        from
          "Caves"
        where
          ST_DWithin(location,
          ST_MakePoint(:long,
          :lat),
          :distance,
        true) = true;`,
        {
          replacements: {
            distance: +distance,
            long: parseFloat(long),
            lat: parseFloat(lat),
          },
          logging: console.log,
          plain: false,
          raw: false,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async changePhoto(req, res, next) {
    try {
      if (!req.file) {
        throw { name: "noFile" };
      }
      let { id } = req.params;
      let cafe = await Cafe.findByPk(id);
      if (!cafe) {
        throw { name: "notFound", id };
      }
      let dataURI = convertToURI(req.file);
      let fileName = getFileName(req.file);
      let uploaded = await cloudinary.uploader.upload(dataURI, {
        public_id: fileName,
        folder: "reconnect",
      });
      await Cafe.update({ photo: uploaded.url }, { where: { id } });
      res.status(200).json({ message: "Cafe photo updated" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async changeDescription(req, res, next) {
    try {
      let { description } = req.body;
      let { id } = req.params;
      let cafe = await Cafe.findByPk(id);
      if (!cafe) {
        throw { name: "notFound", id };
      }
      console.log(description);
      let data = await Cafe.update(
        { description },
        { where: { id }, returning: true }
      );
      console.log(data);
      res.status(200).json({ message: "Cafe description updated" });
    } catch (error) {
      next(error);
    }
  }
  static async changeName(req, res, next) {
    try {
      let { name } = req.body;
      let { id } = req.params;
      let cafe = await Cafe.findByPk(id);
      if (!cafe) {
        throw { name: "notFound", id };
      }
      let data = await Cafe.update(
        { name },
        { where: { id }, returning: true }
      );
      console.log(data);
      res.status(200).json({ message: "Cafe name updated" });
    } catch (error) {
      next(error);
    }
  }
  static async changeAddress(req, res, next) {
    try {
      let { address } = req.body;
      let { id } = req.params;
      let cafe = await Cafe.findByPk(id);
      if (!cafe) {
        throw { name: "notFound", id };
      }
      let data = await Cafe.update(
        { address },
        { where: { id }, returning: true }
      );
      console.log(data);
      res.status(200).json({ message: "Cafe address updated" });
    } catch (error) {
      next(error);
    }
  }
  static async postGallery(req, res, next) {
    try {
      if (!req.file) {
        throw { name: "noFile" };
      }
      let { CafeId } = req.params;
      let cafe = await Cafe.findByPk(CafeId);
      if (!cafe) {
        throw { name: "notFound", CafeId };
      }
      let dataURI = convertToURI(req.file);
      let fileName = getFileName(req.file);
      let uploaded = await cloudinary.uploader.upload(dataURI, {
        public_id: fileName,
        folder: "reconnect",
      });
      await Gallery.create({ imgUrl: uploaded.url, CafeId });
      res.status(200).json({ message: "Success post photo to gallery" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async deletePhotoGallery(req, res, next) {
    try {
      let { id } = req.params;
      let gallery = await Gallery.findByPk(id);
      if (!gallery) {
        throw { name: "notFound", id };
      }
      await Gallery.destroy({ where: { id } });
      res.status(200).json({ message: "Success delete photo from gallery" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = cafeController;
