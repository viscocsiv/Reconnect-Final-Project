const { decodeToken } = require("../helpers/jwt");
const { User } = require("../models");
async function authentication(req, res, next) {
  try {
    // req header authentication
    const { authorization } = req.headers;
    // check authentication ada gk
    if (!authorization) {
      throw { name: "invalidToken" };
    }
    // check bearer atau gk
    let splittedAuth = authorization.split(" ");
    if (splittedAuth[0] !== "Bearer") {
      throw { name: "invalidToken" };
    }
    if (!splittedAuth[1]) {
      throw { name: "invalidToken" };
    }
    // get payload
    const payload = decodeToken(splittedAuth[1]);
    // get user
    const user = await User.findByPk(payload.id, {
      attributes: ["id", "email", "role"],
    });
    // check user ada gk
    if (!user) {
      throw { name: "invalidToken" };
    }
    // inject user ke req
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = authentication;
