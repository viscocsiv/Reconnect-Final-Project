"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Occasion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Occasion.belongsTo(models.Cafe);
      Occasion.belongsTo(models.Category);
      Occasion.hasMany(models.Room);
    }
  }
  Occasion.init(
    {
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Start time is required!",
          },
          notEmpty: {
            msg: "Start is required!",
          },
        },
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "End time is required!",
          },
          notEmpty: {
            msg: "End time is required!",
          },
        },
      },
      description: DataTypes.TEXT,
      photo: {
        type: DataTypes.TEXT,
        defaultValue:
          "https://img.freepik.com/free-photo/friends-clinking-drink-glasses-modern-bar_1150-18971.jpg?size=626&ext=jpg&ga=GA1.2.1647626962.1701751850&semt=ais",
      },
      eventName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Event name is required!",
          },
          notEmpty: {
            msg: "Event name is required!",
          },
        },
      },
      CategoryId: DataTypes.NUMBER,
      CafeId: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Occasion",
    }
  );
  return Occasion;
};
