const { where } = require("sequelize");
const {
  User,
  Gallery,
  Occasion,
  Cafe,
  sequelize,
  Room,
  Message,
} = require("../models");

class roomControllers {
  // create event
  // static async createEvent(req, res, next) {
  //   try {
  //     const userId = req.user.id;
  //     const { startTime, endTime, description, photo, eventName, CategoryId } =
  //       req.body;
  //     const cafeId = await Cafe.findOne({ UserId: userId });

  //     // create event
  //     const eventId = await Occasion.create({
  //       startTime,
  //       endTime,
  //       description,
  //       photo,
  //       eventName,
  //       CategoryId,
  //       CafeId: cafeId.id,
  //     });

  //     // create roooms
  //     await Room.create({
  //       OccasionId: eventId.id,
  //       UserId: userId,
  //     });

  //     res.send({ message: `success add ${eventName} as new event` });
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }

  // join room?
  static async joinRoom(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const room = await Room.findOne({
        where: { OccasionId: id },
      });
      if (!room) {
        throw { name: "notFound", id };
      }
      const roomUser = await Room.findOne({
        where: { OccasionId: id, UserId: userId },
      });
      if (!roomUser) {
        const newUserRoom = await Room.create({
          OccasionId: id,
          UserId: userId,
          RoomId: room.RoomId,
        });
      }
      res.send(room);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //   create msg
  static async createMsg(req, res, next) {
    try {
      const userId = req.user.id;
      const { roomId } = req.params;
      const { message } = req.body;
      //   console.log(roomId, userId, message);

      const newMessage = await Message.create({
        RoomId: roomId,
        UserId: userId,
        message: message,
        time: Date.now(),
      });
      // console.log(newMessage.id);

      const data = await Message.findOne({
        where: {
          id: newMessage.id,
        },
        include: {
          model: User,
          attributes: { exclude: ["password"] },
        },
      });

      res.send(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // list event
  // static async listEvent(req, res, next) {
  //   try {
  //     const listEvent = await Occasion.findAll();
  //     // console.log(listEvent);

  //     res.send(listEvent);
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }

  // listMessage
  static async listMessage(req, res, next) {
    try {
      const { roomId } = req.params;
      // console.log(roomId, ">>>>>>>");
      const roomMsg = await Message.findAll({
        where: {
          RoomId: roomId,
        },
        order: [["createdAt", "DESC"]],
        include: {
          model: User,
          attributes: { exclude: ["password"] },
        },
      });

      res.send(roomMsg);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
module.exports = roomControllers;
