'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsTo(models.User);
      Room.belongsTo(models.Occasion);
      Room.hasMany(models.Message);
    }
  }
  Room.init({
    OccasionId: DataTypes.NUMBER,
    UserId: DataTypes.NUMBER,
    RoomId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};