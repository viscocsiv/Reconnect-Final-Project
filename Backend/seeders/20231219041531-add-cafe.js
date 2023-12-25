"use strict";
const { Cafe } = require("../models");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        description:
          "Be a true cowboy at Kopi Koboy! Discover a fun place to hang out and have a great time. Enjoy a cup of selected coffee in an authentic cowboy atmosphere. When the sun sets, the Cowboy calls you to experience an unforgettable night. Join the lively cowboy party with entertaining live music every night. So, don't hesitate to come and experience a unique adventure at Kopi Koboy now!",
        photo:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmJrJMaVqQmLHtI52vyF8QYQSUJWe-nxVhLzHXFq2gieYqmAbfGjkaZdjri07aCgrdQa8&usqp=CAU",
        location: {
          type: "Point",
          coordinates: [106.78959849557783, -6.258346841589988],
        },
        name: "KOPI KOBOY",
        address:
          "Jl. Bri Radio Dalam No.14 2, RT.2/RW.2, Gandaria Utara, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12140",
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description:
          "Tebalik Kopi, nestled in the heart of a bustling urban neighborhood, is a cozy and inviting coffee haven that captivates patrons with its warm ambiance and rich aromas. As you step through the door, the fragrant symphony of freshly ground coffee beans immediately envelops you, creating a sensory experience that sets the stage for a delightful visit.",
        photo:
          "https://media.licdn.com/dms/image/C4D0BAQHrWNhqy--nEQ/company-logo_200_200/0/1672912526265?e=2147483647&v=beta&t=zBGeI4_PUc2O62YShcZpq2UVAeOYqDWfDCZ2-tH6jVs",
        location: {
          type: "Point",
          coordinates: [106.79053309977108, -6.263565278993579],
        },
        name: "Tebalik Kopi",
        address:
          "Jl. H. Nawi Raya No.3A 9, RT.3/RW.2, Gandaria Sel., Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12420",
        UserId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description:
          "Our story started in the coffee plantations of Brazil, Guatemala and Colombia, where founder, Toby Smith learnt to grow, roast and cup coffee at the source. Inspired by what he had learnt, Toby returned home and converted his mum's garage into a roastery and got to work mastering the art of speciality coffee roasting.",
        photo:
          "https://pikavenue.com/wp-content/uploads/2020/11/toby_estate.png",
        location: {
          type: "Point",
          coordinates: [106.78327698465768, -6.264735375188955],
        },
        name: "Toby's Estate",
        address:
          "Lt. GF Pondok Indah Mall 2, Jl. Metro Pondok Indah No.1, RT.1/RW.16, Pd. Pinang, Kec. Kby. Lama, Daerah Khusus Ibukota Jakarta 12310",
        UserId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    for (const el of data) {
      await Cafe.create(el);
    }
    // await queryInterface.bulkInsert("Caves", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Caves", null, {});
  },
};
