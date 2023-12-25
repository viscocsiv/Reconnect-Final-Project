const request = require("supertest");
const app = require("../app");

async function getToken(email, password) {
  let data = { email, password };
  const response = await request(app).post("/login").send(data);
  return `Bearer ${response.body.access_token}`;
}
module.exports = getToken;
