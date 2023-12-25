"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User);
      Message.belongsTo(models.Room);
    }
  }
  Message.init(
    {
      time: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Time is required!",
          },
          notEmpty: {
            msg: "Time is required!",
          },
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Message is required!",
          },
          notEmpty: {
            msg: "Message is required!",
          },
        },
      },
      RoomId: DataTypes.STRING,
      UserId: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
