"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cafe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cafe.belongsTo(models.User);
      Cafe.hasMany(models.Occasion);
      Cafe.hasMany(models.Gallery);
    }
  }
  Cafe.init(
    {
      description: DataTypes.TEXT,
      photo: {
        type: DataTypes.TEXT,
        defaultValue:
          "https://th.bing.com/th/id/OIP.dwbVjCtNKJYR_aGWmCoTGAHaHa?rs=1&pid=ImgDetMain",
      },
      location: {
        type: DataTypes.GEOMETRY,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Location is required!",
          },
          notEmpty: {
            msg: "Location is required!",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required!",
          },
          notEmpty: {
            msg: "Name is required!",
          },
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Address is required!",
          },
          notEmpty: {
            msg: "Address is required!",
          },
        },
      },
      UserId: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Cafe",
    }
  );
  return Cafe;
};
