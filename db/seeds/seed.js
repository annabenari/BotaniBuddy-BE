const mongoose = require("mongoose");
const connection = require("../connection");
const { plantInfoSchema, usersSchema, plantsSchema } = require("./models");
const PlantInfoData = require("../data/test-data/PlantInfo");
const PlantsData = require("../data/test-data/Plants");
const UserInfoData = require("../data/test-data/UserInfo");

async function seed() {
  console.log("before connection in seed")
  await connection()
  console.log("after connection")
  const PlantInfo = await mongoose.model("PlantInfo", plantInfoSchema);
  const Plants = await mongoose.model("Plants", plantsSchema);
  const Users = await mongoose.model("Users", usersSchema);
  console.log("after schemas")
  await PlantInfo.deleteMany({});
  await PlantInfo.insertMany(PlantInfoData);
  await Plants.deleteMany({});
  await Plants.insertMany(PlantsData);
  await Users.deleteMany({});
  await Users.insertMany(UserInfoData);
}

seed().then(() => mongoose.connection.close())

// module.exports = seed;
