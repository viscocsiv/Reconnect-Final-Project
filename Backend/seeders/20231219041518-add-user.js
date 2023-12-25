"use strict";

const { hashPassword } = require("../helpers/bycrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        username: "ardi",
        email: "ardi@mail.com",
        password: hashPassword("ardiardi"),
        bio: "im owner cafe 1",
        role: "owner",
        avatar:
          "https://i.pinimg.com/originals/b8/9f/27/b89f270e2aee0577efc5e604f08132d1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "lal",
        email: "lal@mail.com",
        password: hashPassword("lallal"),
        bio: "im owner cafe 2",
        role: "owner",
        avatar:
          "https://i.pinimg.com/originals/b8/9f/27/b89f270e2aee0577efc5e604f08132d1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "syifa",
        email: "syifa@mail.com",
        password: hashPassword("syifasyifa"),
        bio: "im owner cafe 3",
        role: "owner",
        avatar:
          "https://i.pinimg.com/originals/b8/9f/27/b89f270e2aee0577efc5e604f08132d1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "wisnu",
        email: "wisnu@mail.com",
        password: hashPassword("wisnuwisnu"),
        bio: "im owner cafe 4",
        role: "owner",
        avatar:
          "https://i.pinimg.com/originals/b8/9f/27/b89f270e2aee0577efc5e604f08132d1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "user1",
        email: "user@mail.com",
        password: hashPassword("useruser"),
        bio: "im user",
        role: "user",
        avatar:
          "https://i.pinimg.com/originals/b8/9f/27/b89f270e2aee0577efc5e604f08132d1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Users", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
