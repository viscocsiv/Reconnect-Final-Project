const { User, Cafe } = require("../models");
const { createToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bycrypt");

class authController {
  static async registerUser(req, res, next) {
    try {
      let { email, password, username } = req.body;
      let data = await User.create({
        username,
        email,
        password,
        role: "user",
      });
      res.status(201).json({ id: data.id, email: data.email });
    } catch (error) {
      next(error);
    }
  }
  static async registerOwner(req, res, next) {
    try {
      let { email, password, username, longitude, latitude, name, address } =
        req.body;

      let data = await User.create({
        username,
        email,
        password,
        role: "owner",
      });
      // ADD NEW CAFE
      let point = { type: "Point", coordinates: [longitude, latitude] };
      let cafe = await Cafe.create({
        name,
        address,
        location: point,
        UserId: data.id,
      });
      res
        .status(201)
        .json({ id: data.id, email: data.email, username: data.username });
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      let { email, password } = req.body;
      // check input
      if (!email) {
        throw { name: "invalidLoginInput", field: "Email" };
      }
      if (!password) {
        throw { name: "invalidLoginInput", field: "Password" };
      }
      // check email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw { name: "unauthorized" };
      }

      // compare password
      if (!comparePassword(password, user.password)) {
        throw { name: "unauthorized" };
      }
      // create token
      const token = createToken({ id: user.id });
      res
        .status(200)
        .json({ access_token: token, id: user.id, role: user.role });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = authController;
