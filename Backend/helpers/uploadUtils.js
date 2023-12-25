const { randomUUID } = require("crypto");

function convertToURI(reqFile) {
  let mediatype = reqFile.mimetype;
  let data = reqFile.buffer.toString("base64");
  let dataURI = `data:${mediatype};base64,${data}`;
  return dataURI;
}
function getFileName(reqFile) {
  return `${randomUUID()}_${reqFile.originalname}`;
}
module.exports = { convertToURI, getFileName };
