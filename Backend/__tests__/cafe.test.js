const request = require("supertest");
const getToken = require("../helpers/getToken");
const app = require("../app");
const fs = require("fs");
const { User, Cafe, Category, Occasion, Room, Gallery } = require("../models");
let filePath = `${__dirname}\\testFiles\\foto-toko.jpg`;
const imageBuffer = fs.readFileSync(filePath); // Buffer

let ownerToken;
let userToken;
beforeAll(async () => {
  // create user
  let user = {
    email: "user1@mail.com",
    password: "user1",
    username: "user1",
    role: "user",
  };
  await User.create(user);
  userToken = await getToken("user1@mail.com", "user1");
  // create owner
  let data = {
    email: "owner1@mail.com",
    password: "owner1",
    username: "owner1",
    role: "owner",
  };
  data = await User.create(data);
  ownerToken = await getToken("owner1@mail.com", "owner1");
  // create cafe
  let point = { type: "Point", coordinates: [106.805534, -6.272444] };
  let cafe = {
    location: point,
    name: "cafe hacktiv",
    address: "hacktiv 8",
    UserId: data.id,
  };
  await Cafe.create(cafe);
  // create category
  let category = {
    name: "music",
  };
  await Category.create(category);
  // create occasion
  let occasion = {
    startTime: new Date(),
    endTime: new Date(),
    description: "asdasd",
    eventName: "event1",
    CategoryId: 1,
    CafeId: 1,
  };
  await Occasion.create(occasion);

  // create room
  let room = {
    EventId: 1,
    UserId: 1,
  };
  await Room.create(room);
});
afterAll(async () => {
  await User.destroy({ truncate: true, restartIdentity: true, cascade: true });
  await Cafe.destroy({ truncate: true, restartIdentity: true, cascade: true });
  await Category.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await Occasion.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await Room.destroy({ truncate: true, restartIdentity: true, cascade: true });
});

describe("GET /cafe/:id", () => {
  test("Success get cafe by id ", async () => {
    const response = await request(app)
      .get("/cafe/1")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.Occasions).toBeInstanceOf(Array);
    expect(response.body.Galleries).toBeInstanceOf(Array);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", expect.any(String));
  });
  test("Get cafe detail failed when user not login", async () => {
    const response = await request(app).get("/cafe/1");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Get cafe detail failed when cafe id not found", async () => {
    const response = await request(app)
      .get("/cafe/999")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("GET /cafe?longitude=xx&latitude=yy", () => {
  test("Success get cafe by location ", async () => {
    const response = await request(app)
      .get("/cafe?longitude=106.805534&latitude=-6.272444")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toBeInstanceOf(Object);
    expect(response.body[0].location).toBeInstanceOf(Object);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
  });
  test("Success get empty array because query location far away ", async () => {
    const response = await request(app)
      .get("/cafe?longitude=10&latitude=10")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });
  test("Get cafes failed when user location not provided", async () => {
    const response = await request(app)
      .get("/cafe")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Get cafes failed when token not valid (not Bearer)", async () => {
    const response = await request(app)
      .get("/cafe?longitude=106.805534&latitude=-6.272444")
      .set("Authorization", "asd asdasdasdasd");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Get cafes failed when token not valid (only bearer)", async () => {
    const response = await request(app)
      .get("/cafe?longitude=106.805534&latitude=-6.272444")
      .set("Authorization", "Bearer");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Get cafes failed when token not valid (jwt not valid)", async () => {
    const response = await request(app)
      .get("/cafe?longitude=106.805534&latitude=-6.272444")
      .set("Authorization", "Bearer asdasd");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Get cafes failed when user not login", async () => {
    const response = await request(app).get("/cafe/1");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH /cafe/change-photo/:id", () => {
  test("Success patch cafe photo with id from params", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .patch("/cafe/change-photo/1")
      .attach("photo", imageBuffer, filename)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch cafe photo detail failed when user not login", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .patch("/cafe/change-photo/1")
      .attach("photo", imageBuffer, filename);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch cafe photo detail failed when id not found", async () => {
    let route = `/cafe/change-photo/999`;
    const response = await request(app)
      .patch(route)
      .attach("photo", filePath)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch cafe photo detail failed when token from user", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .patch("/cafe/change-photo/1")
      .attach("photo", imageBuffer, filename)
      .set("Authorization", userToken);
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch cafe photo detail failed when body is not valid", async () => {
    const response = await request(app)
      .patch("/cafe/change-photo/1")
      .attach("photo", "", "")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH /cafe/description/:id", () => {
  let data = {
    description: "patch description",
  };
  test("Success patch cafe description by id ", async () => {
    const response = await request(app)
      .patch("/cafe/description/1")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch cafe description failed when user not login", async () => {
    const response = await request(app).patch("/cafe/description/1").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch cafe description failed when cafe id not found", async () => {
    const response = await request(app)
      .patch("/cafe/description/999")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH /cafe/name/:id", () => {
  let data = {
    name: "patch name",
  };
  test("Success patch cafe name by id ", async () => {
    const response = await request(app)
      .patch("/cafe/name/1")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch cafe name failed when user not login", async () => {
    const response = await request(app).patch("/cafe/name/1").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch cafe name failed when cafe id not found", async () => {
    const response = await request(app)
      .patch("/cafe/name/999")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH /cafe/address/:id", () => {
  let data = {
    address: "patch address",
  };
  test("Success patch cafe adress by id ", async () => {
    const response = await request(app)
      .patch("/cafe/address/1")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch cafe adress failed when user not login", async () => {
    const response = await request(app).patch("/cafe/address/1").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch cafe adress failed when cafe id not found", async () => {
    const response = await request(app)
      .patch("/cafe/address/999")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("POST /cafe/gallery/:CafeId", () => {
  test("Success post cafe photo with id from params", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .post("/cafe/gallery/1")
      .attach("imgUrl", imageBuffer, filename)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Post cafe photo detail failed when user not login", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .post("/cafe/gallery/1")
      .attach("imgUrl", imageBuffer, filename);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Post cafe photo detail failed when id not found", async () => {
    let route = `/cafe/gallery/999`;
    const response = await request(app)
      .post(route)
      .attach("imgUrl", filePath)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Post cafe photo detail failed when token from user", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .post("/cafe/gallery/1")
      .attach("imgUrl", imageBuffer, filename)
      .set("Authorization", userToken);
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Post cafe photo detail failed when body is not valid", async () => {
    const response = await request(app)
      .post("/cafe/gallery/1")
      .attach("imgUrl", "", "")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("DELETE /cafe/gallery/:id", () => {
  beforeEach(async () => {
    let gallery = {
      id: 2,
      imgUrl: "asdasd",
      CafeId: 1,
    };
    await Gallery.create(gallery);
  });

  afterEach(async () => {
    await Gallery.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  test("Success delete cafe photo in galerry with id from params", async () => {
    const response = await request(app)
      .delete("/cafe/gallery/2")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Delete cafe photo photo in galerry failed when user not login", async () => {
    const response = await request(app).delete("/cafe/gallery/2");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Delete cafe photo photo in galerry failed when id not found", async () => {
    let route = `/cafe/gallery/999`;
    const response = await request(app)
      .delete(route)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});
