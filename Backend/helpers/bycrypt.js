const bcrypt = require("bcryptjs");

function hashPassword(plainPassword) {
  return bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(10));
}
function comparePassword(plainPassword, hashPassword) {
  return bcrypt.compareSync(plainPassword, hashPassword);
}
module.exports = { hashPassword, comparePassword };
