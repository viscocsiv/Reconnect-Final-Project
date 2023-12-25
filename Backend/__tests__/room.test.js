const request = require("supertest");
const getToken = require("../helpers/getToken");
const app = require("../app");
const fs = require("fs");
const { User, Cafe, Category, Occasion, Room, Message } = require("../models");
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
    id: 123,
    startTime: new Date(),
    endTime: new Date(),
    description: "asdasd",
    eventName: "event1",
    CategoryId: 1,
    CafeId: 1,
  };
  await Occasion.create(occasion);

  await Room.create({
    OccasionId: 123,
    UserId: 2,
    RoomId: "1_123",
  });
  await Message.create({
    message: "test message 1",
    UserId: 2,
    RoomId: "1_123",
    time: new Date(),
  });
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
  await Message.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("GET /room/occasion/:id", () => {
  test("Success join room chat occasion by id ", async () => {
    const response = await request(app)
      .get("/room/occasion/123")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("OccasionId", expect.any(Number));
    expect(response.body).toHaveProperty("UserId", expect.any(Number));
    expect(response.body).toHaveProperty("RoomId", expect.any(String));
  });
  test("Join room chat occasion failed when user not login", async () => {
    const response = await request(app).get("/room/occasion/1");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Join room chat occasion failed when occasion id not found", async () => {
    const response = await request(app)
      .get("/room/occasion/999")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("POST /room/create-message/:roomId", () => {
  test("Success send message to room", async () => {
    let data = {
      message: "test message",
    };
    const response = await request(app)
      .post("/room/create-message/1_123")
      .set("Authorization", ownerToken)
      .send(data);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("UserId", expect.any(Number));
    expect(response.body).toHaveProperty("RoomId", expect.any(String));
    expect(response.body).toHaveProperty("message", expect.any(String));
    expect(response.body.User).toBeInstanceOf(Object);
  });
  test("Send message to room chat failed when user not login", async () => {
    const response = await request(app).post("/room/create-message/1_123");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("GET /room/list-message/:roomId", () => {
  test("Success get room chat occasion by roomId ", async () => {
    const response = await request(app)
      .get("/room/list-message/1_123")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("message", expect.any(String));
    expect(response.body[0]).toHaveProperty("time", expect.any(String));
    expect(response.body[0]).toHaveProperty("UserId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("RoomId", expect.any(String));
  });
  test("Success get empty array when room id not found ", async () => {
    const response = await request(app)
      .get("/room/list-message/999")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });
  test("Get room chat message failed when user not login", async () => {
    const response = await request(app).get("/room/list-message/1");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});
