const mongoose = require("mongoose");
const connection = require("../connection");
const { plantInfoSchema, usersSchema, plantsSchema } = require("./models");
const PlantInfoData = require("../data/test-data/PlantInfo");
const PlantsData = require("../data/test-data/Plants");
const UserInfoData = require("../data/test-data/UserInfo");

async function seed() {
  console.log("before connection in seed");
  await connection();
  console.log("after connection");
  const PlantInfo = await mongoose.model("PlantInfo", plantInfoSchema);
  const Plants = await mongoose.model("Plants", plantsSchema);
  const Users = await mongoose.model("Users", usersSchema);
  console.log("after schemas");
  await PlantInfo.deleteMany({});
  await Plants.deleteMany({});
  await Users.deleteMany({});

  PlantInfoData.forEach(async (plantInfo, index) => {
    const plantInfoId = new mongoose.Types.ObjectId()
    await PlantInfo.create({
      _id: plantInfoId,
      ...plantInfo,
    })
    const plantId = new mongoose.Types.ObjectId()
    const userId = new mongoose.Types.ObjectId()
    await Plants.create({
      _id: plantId,
      ...PlantsData[index],
      users: [userId],
      plantType: plantInfoId
    })
    await Users.create({
      _id: userId,
      ...UserInfoData[index],
      plants: [plantId]
    })
  })

  await mongoose.connection.close();
  console.log("after disconnect")
}

/*
for loop length 30
create plantinfo id
insert plantinfo( {
  _id: plantinfo id
  ...
})
create plant id
create user id
insert plant ({
  _id: plant id
  ...
  users: [user id]
  plantType: plantInfo id
})

insert user ({
  _id: user id
  ...
  plants: [plant id]
})
*/

seed();

module.exports = seed;
