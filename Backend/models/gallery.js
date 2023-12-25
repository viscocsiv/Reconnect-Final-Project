"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Gallery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Gallery.belongsTo(models.Cafe);
    }
  }
  Gallery.init(
    {
      imgUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "ImgUrl is required!",
          },
          notEmpty: {
            msg: "ImgUrl is required!",
          },
        },
      },
      CafeId: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Gallery",
    }
  );
  return Gallery;
};
