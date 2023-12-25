async function onlyOwner(req, res, next) {
  try {
    // check req.user
    if (req.user.role === "owner") {
      next();
    } else {
      throw { name: "forbidden" };
    }
  } catch (error) {
    next(error);
  }
}

module.exports = onlyOwner;
