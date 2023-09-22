const mongoose = require("mongoose");
const connection = require("../connection");
const { plantInfoSchema, usersSchema, plantsSchema } = require("./models");


async function seed({PlantInfoData, PlantsData, UserInfoData}) {
  await connection();
  
  const PlantInfo = await mongoose.model("PlantInfo", plantInfoSchema);
  const Plants = await mongoose.model("Plants", plantsSchema);
  const Users = await mongoose.model("Users", usersSchema);
  
  await PlantInfo.deleteMany({});
  await Plants.deleteMany({});
  await Users.deleteMany({});
  


  for (let index = 0; index < PlantInfoData.length; index++) {

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

// One owner has 3 plants
  const plantIds = await Plants.find({}, "_id", { limit: 3 });
  const plantIdsArray = plantIds.map((id) => {
    return id._id;
  });
  const filter = { username: UserInfoData[0].username };
  const update = { plants: plantIdsArray };
  await Users.findOneAndUpdate(filter, update);
  const allUsers = await Users.find();
  

  // One plant has multiple (3) owners
  const userIds = await Users.find({}, "_id", { limit: 3 });
  const userIdsArray = userIds.map((id) => id._id);
  const plantId = await Plants.find({}, "_id", { limit: 1 })
  await Plants.findOneAndUpdate({_id: plantId[0]._id}, {users: userIdsArray});
  const allPlants = await Plants.find()
  
  await Users.create(UserInfoData[4])
}

module.exports = seed;
