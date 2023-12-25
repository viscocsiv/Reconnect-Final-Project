"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ctg = [
      {
        name: "music",
        thumbnail:
          "https://img.freepik.com/free-photo/vinyl-discs-with-headphones_23-2148133518.jpg?w=740&t=st=1702611183~exp=1702611783~hmac=28ec2c2cdb0d9188c5a7cee1a6e7f01368d514b49c2761af8298883fccf9946d",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "stand up commedy",
        thumbnail:
          "https://img.freepik.com/free-photo/retro-microphone-isolated-color-background_1387-912.jpg?w=740&t=st=1702611199~exp=1702611799~hmac=c0473a1f5933375f3c7b6171e059ae60c63b88f03358532b2c86ba8b627f66e6",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Performance",
        thumbnail:
          "https://img.freepik.com/free-vector/opera-theater-scene-flat-cartoon-with-2-singers-aria-onstage-performance-audience-silhouettes_1284-28612.jpg?w=826&t=st=1702611244~exp=1702611844~hmac=cbd6a09cd085f2b69b93cb3d6038815665e0f34497b54424d97134c03e6aab89",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Competitions",
        thumbnail:
          "https://img.freepik.com/free-photo/arrangement-different-olympics-medals_23-2148930688.jpg?w=826&t=st=1702611271~exp=1702611871~hmac=8161508be5fef7db0f3dd1ddca1c6238df6e70e90d101f8b8884921e08de30c3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Categories", ctg);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
