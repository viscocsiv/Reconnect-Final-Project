const request = require("supertest");
const app = require("../app");
const { User, Cafe } = require("../models");
beforeAll(async () => {
  let user = {
    email: "user1@mail.com",
    password: "user1",
    username: "user1",
    role: "user",
  };
  await User.create(user);
  let data = {
    email: "owner1@mail.com",
    password: "owner1",
    username: "owner1",
    role: "owner",
  };
  data = await User.create(data);
  let point = { type: "Point", coordinates: [106.805534, -6.272444] };
  let cafe = {
    location: point,
    name: "cafe hacktiv",
    address: "hacktiv 8",
    UserId: data.id,
  };
  await Cafe.create(cafe);
});
afterAll(async () => {
  await User.destroy({ truncate: true, restartIdentity: true, cascade: true });
  await Cafe.destroy({ truncate: true, restartIdentity: true, cascade: true });
});

describe("POST /login", () => {
  test("Email is required", async () => {
    let data = { email: "", password: "owner1" };
    const response = await request(app).post("/login").send(data);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required!");
  });
  test("Password is required", async () => {
    let data = { email: "owner1@mail.com", password: "" };
    const response = await request(app).post("/login").send(data);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required!");
  });
  test("Email is not valid", async () => {
    let data = { email: "asdasd@mail.com", password: "owner1" };
    const response = await request(app).post("/login").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password!"
    );
  });
  test("Password is not valid", async () => {
    let data = { email: "owner1@mail.com", password: "asdasd" };
    const response = await request(app).post("/login").send(data);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password!"
    );
  });
  test("Login success", async () => {
    let data = { email: "owner1@mail.com", password: "owner1" };
    const response = await request(app).post("/login").send(data);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });
});

describe("POST /register/user", () => {
  test("Register success", async () => {
    let data = {
      username: "user2user2",
      email: "user2@mail.com",
      password: "user2",
    };
    const response = await request(app).post("/register/user").send(data);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("email", expect.any(String));
  });
  test("Email is required", async () => {
    let data = { username: "user3user3", password: "user3" };
    const response = await request(app).post("/register/user").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required!");
  });
  test("Password is required", async () => {
    let data = { username: "user3user3", email: "user3@mail.com" };
    const response = await request(app).post("/register/user").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required!");
  });
  test("Email is empty string", async () => {
    let data = { username: "user3user3", email: "", password: "user3" };
    const response = await request(app).post("/register/user").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Email format is not valid!"
    );
  });
  test("Password is empty string", async () => {
    let data = {
      username: "user3user3",
      email: "user3@mail.com",
      password: "",
    };
    const response = await request(app).post("/register/user").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Password length must be 5 or greater!"
    );
  });
  test("Email already exist", async () => {
    let data = {
      username: "user1user1",
      email: "user1@mail.com",
      password: "user1",
    };
    const response = await request(app).post("/register/user").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "email must be unique");
  });
  test("Email is not valid", async () => {
    let data = { username: "user3user3", email: "asdasd", password: "user3" };
    const response = await request(app).post("/register/user").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Email format is not valid!"
    );
  });
});

describe("POST /register/owner", () => {
  test("Register success", async () => {
    let data = {
      email: "ownerRegister@mail.com",
      password: "ownerRegister",
      username: "ownerRegister",
      longitude: 106.805534,
      latitude: -6.272444,
      name: "cafe hacktiv",
      address: "hacktiv 8",
    };
    const response = await request(app).post("/register/owner").send(data);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("email", expect.any(String));
  });
  test("Email is required", async () => {
    let data = {
      password: "ownerRegister",
      username: "ownerRegister",
      longitude: 106.805534,
      latitude: -6.272444,
      name: "cafe hacktiv",
      address: "hacktiv 8",
    };
    const response = await request(app).post("/register/owner").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required!");
  });
  test("Password is required", async () => {
    let data = {
      email: "ownerRegister@mail.com",
      username: "ownerRegister",
      longitude: 106.805534,
      latitude: -6.272444,
      name: "cafe hacktiv",
      address: "hacktiv 8",
    };
    const response = await request(app).post("/register/owner").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required!");
  });
  test("Email already exist", async () => {
    let data = {
      username: "user1user1",
      email: "user1@mail.com",
      password: "user1",
      longitude: 106.805534,
      latitude: -6.272444,
      name: "cafe hacktiv",
      address: "hacktiv 8",
    };
    const response = await request(app).post("/register/owner").send(data);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "email must be unique");
  });
});
