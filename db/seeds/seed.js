const mongoose = require("../connection");
const { plantInfoSchema, usersSchema, plantsSchema } = require("./models");
const PlantInfoData = require("../data/test-data/PlantInfo");
const PlantsData = require("../data/test-data/Plants");
const UserInfoData = require("../data/test-data/UserInfo");

async function seed() {
  const PlantInfo = mongoose.model("PlantInfo", plantInfoSchema);
  const Plants = mongoose.model("Plants", plantsSchema);
  const Users = mongoose.model("Users", usersSchema);

  PlantInfo.deleteMany({});
  PlantInfo.insertMany(PlantInfoData);
  Plants.deleteMany({});
  Plants.insertMany(PlantsData);
  Users.deleteMany({});
  Users.insertMany(UserInfoData);
}

seed().then(() => {
  mongoose.connection.close();
});

module.exports = seed;
