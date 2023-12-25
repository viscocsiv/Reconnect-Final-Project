function errorHandler(err, req, res, next) {
  //  check condition error
  if (err.name === "JsonWebTokenError" || err.name === "invalidToken") {
    res.status(401).json({ message: "Invalid Token!" });
  } else if (err.name === "unauthorized") {
    res.status(401).json({ message: "Invalid email or password!" });
  } else if (err.name === "invalidLoginInput") {
    res.status(400).json({ message: `${err.field} is required!` });
  } else if (err.name === "noFile") {
    res.status(400).json({ message: `Image file is required!` });
  } else if (err.name === "noUserLocation") {
    res.status(400).json({ message: `Need user location (longitude, latitude) to query cafe` });
  } else if (err.name === "notFound") {
    res.status(404).json({ message: `Data with id ${err.id} is not found` });
  } else if (err.name === "forbidden") {
    res
      .status(403)
      .json({ message: `You are not authorize to do this action` });
  } else if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    res.status(400).json({ message: err.errors[0].message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
module.exports = errorHandler;
