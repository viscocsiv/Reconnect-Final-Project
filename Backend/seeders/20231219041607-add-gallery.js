"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = [
      {
        imgUrl:
          "https://lh3.googleusercontent.com/p/AF1QipOiyj1-4JQ7TKEUfiKL_pAGhaizM3MRNwaQByKv=s1360-w1360-h1020",
        CafeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        imgUrl:
          "https://lh3.googleusercontent.com/p/AF1QipNdctAqSA_9cyVTzgFDmKgViMv0LexAGs88SJ4U=s1360-w1360-h1020",
        CafeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        imgUrl:
          "https://lh3.googleusercontent.com/p/AF1QipNdctAqSA_9cyVTzgFDmKgViMv0LexAGs88SJ4U=s1360-w1360-h1020",
        CafeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        imgUrl:
          "https://lh3.googleusercontent.com/p/AF1QipOSOUybQjFZbRHUisP3MmA1xj2fAmOAOEJ3HsS9=s1360-w1360-h1020",
        CafeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        imgUrl:
          "https://lh3.googleusercontent.com/p/AF1QipN6Mt2q_CHMrnIIruYjmIeQP0dkgCyp4164KV2c=s1360-w1360-h1020",
        CafeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        imgUrl:
          "https://assets-pergikuliner.com/E9XVQtse_tF4bIqCif0MjgV39g0=/945x0/smart/filters:watermark(https://assets-pergikuliner.com/assets/pegimakan-logo-3e147c56e232f471596371920946ae65.png,-0,-3,10):no_upscale()/https://assets-pergikuliner.com/uploads/image/picture/2065937/picture-1604481999.jpg",
        CafeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        imgUrl:
          "https://lh3.googleusercontent.com/p/AF1QipOq4acAtCqjU2SodwR8029ZxAZpyvv6ylDcMnPQ=s1360-w1360-h1020",
        CafeId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        imgUrl:
          "https://lh3.googleusercontent.com/p/AF1QipO3Ooi2nDBqla7kDepiyymRFfzb4dExLrFJSkCH=s1360-w1360-h1020",
        CafeId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        imgUrl:
          "https://media-cdn.yummyadvisor.com/store/70d74353-d035-48e8-a490-9f648a29f09d.jpg",
        CafeId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Galleries", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Galleries", null, {});
  },
};
