const mongoose = require("mongoose");
const connection = require("../connection");
const { plantInfoSchema, usersSchema, plantsSchema } = require("./models");
const PlantInfoData = require("../data/test-data/PlantInfo");
const PlantsData = require("../data/test-data/Plants");
const UserInfoData = require("../data/test-data/UserInfo");

async function seed() {
  console.log("before connection in seed");
  await connection();
  console.log("after connection in seed");
  const PlantInfo = await mongoose.model("PlantInfo", plantInfoSchema);
  const Plants = await mongoose.model("Plants", plantsSchema);
  const Users = await mongoose.model("Users", usersSchema);
  console.log("after schemas");
  await PlantInfo.deleteMany({});
  await Plants.deleteMany({});
  await Users.deleteMany({});
  console.log("after deleting");

  for (let index = 0; index < PlantInfoData.length; index++) {
    console.log(index);
    const plantInfoId = new mongoose.Types.ObjectId();
    await PlantInfo.create({
      _id: plantInfoId,
      ...PlantInfoData[index],
    });
    const plantId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    await Plants.create({
      _id: plantId,
      ...PlantsData[index],
      users: [userId],
      plantType: plantInfoId,
    });
    await Users.create({
      _id: userId,
      ...UserInfoData[index],
      plants: [plantId],
    });
  }
  const plantIds = await Plants.find({}, "_id", { limit: 3 });
  console.log(plantIds);
  const plantIdsArray = plantIds.map((id) => {
    return id._id;
  });
  console.log(plantIdsArray);
  const filter = { username: UserInfoData[0].username };
  const update = { plants: plantIdsArray };

  await Users.findOneAndUpdate(filter, update);

  const allUsers = await Users.find();
  console.log(allUsers);

  const userIds = await Users.find({}, "_id", { limit: 3 });
  const userIdsArray = userIds.map((id) => id._id);
  console.log(userIdsArray)

  const plantId = await Plants.find({}, "_id", { limit: 1 })

  console.log(plantId);
  await Plants.findOneAndUpdate({_id: plantId[0]._id}, {users: userIdsArray});

  const allPlants = await Plants.find()

  console.log(allPlants)

  console.log("before disconnect");
  await mongoose.connection.close();
  console.log("after disconnect");
}

seed();

module.exports = seed;
