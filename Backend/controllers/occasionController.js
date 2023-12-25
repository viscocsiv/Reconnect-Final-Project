const { Category, Occasion, Cafe, Room, sequelize } = require("../models");
const { convertToURI, getFileName } = require("../helpers/uploadUtils");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class occasionController {
  static async createOccasion(req, res, next) {
    try {
      const userId = req.user.id;
      const { startTime, endTime, description, eventName, CategoryId } =
        req.body;
      const cafeId = await Cafe.findOne({ UserId: userId });
      if (!CategoryId) {
        // borrow invalidLoginInput to validate CategoryId
        throw { name: "invalidLoginInput", field: "CategoryId" };
      }
      if (!cafeId) {
        throw { name: "notFound", userId };
      }
      if (!req.file) {
        throw { name: "noFile" };
      }
      let dataURI = convertToURI(req.file);
      let fileName = getFileName(req.file);
      let uploaded = await cloudinary.uploader.upload(dataURI, {
        public_id: fileName,
        folder: "reconnect",
      });
      const eventId = await Occasion.create({
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
        photo: uploaded.url,
        eventName,
        CategoryId,
        CafeId: cafeId.id,
      });

      await Room.create({
        OccasionId: eventId.id,
        UserId: userId,
        RoomId:`${userId}_${Date.now()}`
      });

      res.send({ message: `success add ${eventName} as new event` });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async getOccasionById(req, res, next) {
    try {
      let { id } = req.params;
      let data = await Occasion.findByPk(id, {
        include: [
          {
            model: Cafe,
          },
          {
            model: Category,
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
  static async getOccasionByUserLocation(req, res, next) {
    try {
      const distance = 5000;
      const long = req.query.longitude;
      const lat = req.query.latitude;
      const CategoryId = req.query.CategoryId;
      if (!long || !lat) {
        throw { name: "noUserLocation" };
      }
      let query = `
      WITH cte AS (
        SELECT  *
        FROM 
          "Caves"
        WHERE 
          ST_DWithin(location,
          ST_MakePoint(:long,:lat),
          :distance,
          TRUE) = TRUE
      )
      SELECT oc.id AS "eventId",oc.photo AS "eventPhoto", oc.*,cte.*,ca.name AS "categoryName"
      FROM "Occasions" AS oc
      INNER JOIN cte ON oc."CafeId" = cte.id
      JOIN "Categories" AS ca ON oc."CategoryId" = ca.id
      `;
      if (CategoryId) {
        query += `WHERE oc."CategoryId" = ${CategoryId}`;
      }
      const result = await sequelize.query(query, {
        replacements: {
          distance: +distance,
          long: parseFloat(long),
          lat: parseFloat(lat),
        },
        logging: console.log,
        plain: false,
        raw: false,
        type: sequelize.QueryTypes.SELECT,
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async changeDescription(req, res, next) {
    try {
      let { description } = req.body;
      let { id } = req.params;
      let cafe = await Occasion.findByPk(id);
      if (!cafe) {
        throw { name: "notFound", id };
      }
      let data = await Occasion.update(
        { description },
        { where: { id }, returning: true }
      );
      res.status(200).json({ message: "Event description updated" });
    } catch (error) {
      next(error);
    }
  }
  static async changeEventName(req, res, next) {
    try {
      let { eventName } = req.body;
      let { id } = req.params;
      let cafe = await Occasion.findByPk(id);
      if (!cafe) {
        throw { name: "notFound", id };
      }
      let data = await Occasion.update(
        { eventName },
        { where: { id }, returning: true }
      );
      res.status(200).json({ message: "Event name updated" });
    } catch (error) {
      next(error);
    }
  }
  static async changeStartTime(req, res, next) {
    try {
      let { startTime } = req.body;
      let { id } = req.params;
      let cafe = await Occasion.findByPk(id);
      if (!cafe) {
        throw { name: "notFound", id };
      }
      let data = await Occasion.update(
        { startTime },
        { where: { id }, returning: true }
      );
      res.status(200).json({ message: "Event start time updated" });
    } catch (error) {
      next(error);
    }
  }
  static async changeEndTime(req, res, next) {
    try {
      let { endTime } = req.body;
      let { id } = req.params;
      let cafe = await Occasion.findByPk(id);
      if (!cafe) {
        throw { name: "notFound", id };
      }
      let data = await Occasion.update(
        { endTime },
        { where: { id }, returning: true }
      );
      res.status(200).json({ message: "Event start time updated" });
    } catch (error) {
      next(error);
    }
  }
  static async changePhoto(req, res, next) {
    try {
      if (!req.file) {
        throw { name: "noFile" };
      }
      let { id } = req.params;
      let cafe = await Occasion.findByPk(id);
      if (!cafe) {
        throw { name: "notFound", id };
      }
      let dataURI = convertToURI(req.file);
      let fileName = getFileName(req.file);
      let uploaded = await cloudinary.uploader.upload(dataURI, {
        public_id: fileName,
        folder: "reconnect",
      });
      await Occasion.update({ photo: uploaded.url }, { where: { id } });
      res.status(200).json({ message: "Event photo updated" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = occasionController;
