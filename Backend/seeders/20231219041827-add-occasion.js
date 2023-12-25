"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = [
      {
        startTime: "2023-12-31T12:00:00.437Z",
        endTime: "2024-12-31T12:00:00.437Z",
        description:
          "Get ready to bid farewell to the old and welcome the new in the most melodious way possible! Join us at the New Year's Eve Music Extravaganza, where pulsating beats and euphonious tunes will set the stage for an unforgettable night of celebration.",
        photo:
          "https://lh3.googleusercontent.com/p/AF1QipPmKBMxIG0Arns3BqcYRs0AcYLEHS-EyjUhsFmd=s1360-w1360-h1020",
        eventName: "New Year's Live Music",
        CategoryId: 1,
        CafeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        startTime: "2023-12-24T16:00:00.437Z",
        endTime: "2024-12-24T16:00:00.437Z",
        description:
          "Ditch the traditional and usher in the New Year with a unique musical experience at our very own coffee haven, Java Jamboree: New Year's Groove. Join us for an intimate celebration where the rich notes of live music blend seamlessly with the comforting aroma of freshly brewed coffee.",
        photo: "https://i.ytimg.com/vi/d_d_Kb8sQLU/maxresdefault.jpg",
        eventName: "AXL Live Session",
        CategoryId: 1,
        CafeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        startTime: "2024-01-31T16:00:00.437Z",
        endTime: "2024-01-31T23:00:00.437Z",
        description:
          "Prepare for a night of hilarity and joy as we present the ultimate New Year's Eve Stand-up Comedy Extravaganza! Join us for Comedy Countdown 2024, where laughter is the best way to welcome the year ahead.",
        photo:
          "https://linimassa.id/wp-content/uploads/2023/07/Stand-Up-Comedy-Linimassa.jpg",
        eventName: "Comedy Night Up",
        CategoryId: 2,
        CafeId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Occasions", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Occasions", null, {});
  },
};
