"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = [
      {
        OccasionId: 1,
        UserId: 1,
        RoomId: `1_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        OccasionId: 2,
        UserId: 2,
        RoomId: `2_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        OccasionId: 3,
        UserId: 3,
        RoomId: `3_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Rooms", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Rooms", null, {});
  },
};
