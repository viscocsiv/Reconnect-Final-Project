const request = require("supertest");
const getToken = require("../helpers/getToken");
const app = require("../app");
const fs = require("fs");
const { User, Cafe, Category, Occasion, Room } = require("../models");
let filePath = `${__dirname}\\testFiles\\foto-toko.jpg`;
const imageBuffer = fs.readFileSync(filePath); // Buffer

let ownerToken;
beforeAll(async () => {
  // create user
  let user = {
    email: "user1@mail.com",
    password: "user1",
    username: "user1",
    role: "user",
  };
  // create owner
  await User.create(user);
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

describe("GET user/:id", () => {
  test("Success get user by id ", async () => {
    const response = await request(app)
      .get("/user/1")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.Rooms).toBeInstanceOf(Array);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("role", expect.any(String));
  });
  test("Get user detail failed when user not login", async () => {
    const response = await request(app).get("/user/1");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Get user detail failed when user id not found", async () => {
    const response = await request(app)
      .get("/user/999")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH user/bio/:id", () => {
  let data = {
    bio: "patch bio",
  };
  test("Success patch user bio by id ", async () => {
    const response = await request(app)
      .patch("/user/bio/1")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch user bio failed when user not login", async () => {
    const response = await request(app).patch("/user/bio/1").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch user bio failed when user id not found", async () => {
    const response = await request(app)
      .patch("/user/bio/999")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH /user/avatar/:id", () => {
  test("Success patch user avatar with id from params", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .patch("/user/avatar/1")
      .attach("avatar", imageBuffer, filename)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch user avatar failed when user not login", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .patch("/user/avatar/1")
      .attach("avatar", imageBuffer, filename);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch user avatar failed when id not found", async () => {
    let route = `/user/avatar/999`;
    const response = await request(app)
      .patch(route)
      .attach("avatar", filePath)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch user avatar failed when body is not valid", async () => {
    const response = await request(app)
      .patch("/user/avatar/1")
      .attach("avatar", "", "")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH user/username/:id", () => {
  let data = {
    username: "patch username",
  };
  test("Success patch user username by id ", async () => {
    const response = await request(app)
      .patch("/user/username/1")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch user username failed when user not login", async () => {
    const response = await request(app).patch("/user/username/1").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch user username failed when user id not found", async () => {
    const response = await request(app)
      .patch("/user/username/999")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});
