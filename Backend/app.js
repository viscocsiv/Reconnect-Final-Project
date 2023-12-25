// npx sequelize-cli model:generate --name User --attributes email:string,password:string,bio:text,avatar:text,role:string,username:string
// npx sequelize-cli model:generate --name Cafe --attributes description:string,photo:text,location:geometry,name:string,address:text,UserId:number
// npx sequelize-cli model:generate --name Gallery --attributes imgUrl:text,cafeId:number
// npx sequelize-cli model:generate --name Occasion --attributes startTime:date,endTime:date,description:text,photo:text,eventName:string,CategoryId:number,CafeId:number
// npx sequelize-cli model:generate --name Category --attributes name:string,thumbnail:text
// npx sequelize-cli model:generate --name Room --attributes OccasionId:number,UserId:number,RoomId:string
// npx sequelize-cli model:generate --name Message --attributes time:date,message:text,RoomId:number,UserId:number

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const route = require("./routers/index");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

// router
app.use(route);

// error handling
app.use(errorHandler);

module.exports = app;
