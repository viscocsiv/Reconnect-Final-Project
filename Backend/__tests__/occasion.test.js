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
    id: 123,
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
    OccasionId: 123,
    UserId: 1,
    RoomId:1
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

describe("POST /occasion", () => {
  test("Create event success", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .post("/occasion")
      .set("Authorization", ownerToken)
      .attach("photo", imageBuffer, filename)
      .field("startTime", "2023-12-16T04:43:33.437Z")
      .field("endTime", "2023-12-16T05:43:33.437Z")
      .field("description", "test1")
      .field("eventName", "test1")
      .field("CategoryId", 1);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Create event fail when CategoryId not provided", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .post("/occasion")
      .set("Authorization", ownerToken)
      .attach("photo", imageBuffer, filename)
      .field("startTime", "2023-12-16T04:43:33.437Z")
      .field("endTime", "2023-12-16T05:43:33.437Z")
      .field("description", "test1")
      .field("eventName", "test1");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Create event fail when photo file not provided", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .post("/occasion")
      .set("Authorization", ownerToken)
      .field("startTime", "2023-12-16T04:43:33.437Z")
      .field("endTime", "2023-12-16T05:43:33.437Z")
      .field("description", "test1")
      .field("eventName", "test1");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Create event fail when owner not login", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .post("/occasion")
      .attach("photo", imageBuffer, filename)
      .field("startTime", "2023-12-16T04:43:33.437Z")
      .field("endTime", "2023-12-16T05:43:33.437Z")
      .field("description", "test1")
      .field("eventName", "test1")
      .field("CategoryId", 1);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Create event fail when user try create event", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .post("/occasion")
      .set("Authorization", userToken)
      .attach("photo", imageBuffer, filename)
      .field("startTime", "2023-12-16T04:43:33.437Z")
      .field("endTime", "2023-12-16T05:43:33.437Z")
      .field("description", "test1")
      .field("eventName", "test1")
      .field("CategoryId", 1);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("GET /occasion/:id", () => {
  test("Success get occasion by id ", async () => {
    const response = await request(app)
      .get("/occasion/123")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body.Cafe).toHaveProperty("id", expect.any(Number));
    expect(response.body.Cafe).toHaveProperty("name", expect.any(String));
    expect(response.body.Category).toHaveProperty("id", expect.any(Number));
    expect(response.body.Category).toHaveProperty("name", expect.any(String));
  });
  test("Get occasion detail failed when user not login", async () => {
    const response = await request(app).get("/occasion/123");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Get occasion detail failed when cafe id not found", async () => {
    const response = await request(app)
      .get("/occasion/999")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});


describe("GET /occasion?longitude=xx&latitude=yy", () => {
  test("Success get occasion by location ", async () => {
    const response = await request(app)
      .get("/occasion?longitude=106.805534&latitude=-6.272444")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toBeInstanceOf(Object);
    expect(response.body[0]).toHaveProperty("eventId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("eventName", expect.any(String));
    expect(response.body[0]).toHaveProperty("categoryName", expect.any(String));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
  });
  test("Success get empty array because query location far away ", async () => {
    const response = await request(app)
      .get("/occasion?longitude=10&latitude=10")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });
  test("Get occasions failed when user location not provided", async () => {
    const response = await request(app)
      .get("/occasion")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Get occasions failed when token not valid (not Bearer)", async () => {
    const response = await request(app)
      .get("/occasion?longitude=106.805534&latitude=-6.272444")
      .set("Authorization", "asd asdasdasdasd");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Get occasions failed when token not valid (only bearer)", async () => {
    const response = await request(app)
      .get("/occasion?longitude=106.805534&latitude=-6.272444")
      .set("Authorization", "Bearer");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Get occasions failed when token not valid (jwt not valid)", async () => {
    const response = await request(app)
      .get("/occasion?longitude=106.805534&latitude=-6.272444")
      .set("Authorization", "Bearer asdasd");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Get occasions failed when user not login", async () => {
    const response = await request(app).get("/occasion?longitude=106.805534&latitude=-6.272444");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH /occasion/description/:id", () => {
  let data = {
    description: "patch description",
  };
  test("Success patch occasion description by id ", async () => {
    const response = await request(app)
      .patch("/occasion/description/123")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion description failed when user not login", async () => {
    const response = await request(app).patch("/occasion/description/123").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion description failed when occasion id not found", async () => {
    const response = await request(app)
      .patch("/occasion/description/999")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH /occasion/eventName/:id", () => {
  let data = {
    description: "patch eventName",
  };
  test("Success patch occasion eventName by id ", async () => {
    const response = await request(app)
      .patch("/occasion/eventName/123")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion eventName failed when user not login", async () => {
    const response = await request(app).patch("/occasion/eventName/123").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion eventName failed when occasion id not found", async () => {
    const response = await request(app)
      .patch("/occasion/eventName/999")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH /occasion/startTime/:id", () => {
  let data = {
    description: "patch startTime",
  };
  test("Success patch occasion startTime by id ", async () => {
    const response = await request(app)
      .patch("/occasion/startTime/123")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion startTime failed when user not login", async () => {
    const response = await request(app).patch("/occasion/startTime/123").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion startTime failed when occasion id not found", async () => {
    const response = await request(app)
      .patch("/occasion/startTime/999")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH /occasion/endTime/:id", () => {
  let data = {
    description: "patch endTime",
  };
  test("Success patch occasion endTime by id ", async () => {
    const response = await request(app)
      .patch("/occasion/endTime/123")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion endTime failed when user not login", async () => {
    const response = await request(app).patch("/occasion/endTime/123").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion endTime failed when occasion id not found", async () => {
    const response = await request(app)
      .patch("/occasion/endTime/999")
      .send(data)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});

describe("PATCH /occasion/change-photo/:id", () => {
  test("Success patch occasion photo with id from params", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .patch("/occasion/change-photo/123")
      .attach("photo", imageBuffer, filename)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion photo detail failed when user not login", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .patch("/occasion/change-photo/123")
      .attach("photo", imageBuffer, filename);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion photo detail failed when id not found", async () => {
    let route = `/occasion/change-photo/999`;
    const response = await request(app)
      .patch(route)
      .attach("photo", filePath)
      .set("Authorization", ownerToken);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion photo detail failed when token from user", async () => {
    let filename = new Date() + "foto-toko.jpg";
    const response = await request(app)
      .patch("/occasion/change-photo/123")
      .attach("photo", imageBuffer, filename)
      .set("Authorization", userToken);
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
  test("Patch occasion photo detail failed when body is not valid", async () => {
    const response = await request(app)
      .patch("/occasion/change-photo/123")
      .attach("photo", "", "")
      .set("Authorization", ownerToken);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});