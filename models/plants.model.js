const mongoose = require("mongoose");
const { usersSchema, plantInfoSchema, plantsSchema } = require("../db/seeds/models");


exports.fetchPlants = (user_id) =>{
    const Users = mongoose.model("Users", usersSchema);
    return Users.findById(user_id)
    .then((user) => {
      if(user === null){
        return Promise.reject({
          status:404,
          msg: "Not Found",
          details: "No user found with this username"
        })
      }
      const myPlants = {
        result: user.plants,
      };

      return myPlants;
    })
    .catch((err) => Promise.reject(err));

}

exports.fetchSpecificPlant = async (user_id, plant_id) => {
  const Plants = await mongoose.model("Plants", plantsSchema)
  const PlantInfo = await mongoose.model("PlantInfo", plantInfoSchema)
  const Users = await mongoose.model("Users", usersSchema)

  try{
    const user = await Users.findById(user_id)

    if(!user) {
      return Promise.reject({
        status: 404,
        msg: 'User not found',
        details: 'No user found with this ID'
      })
    }

    const plant = await Plants.findById(plant_id)

    if(!plant) {
      return Promise.reject({
        status: 404,
        msg: 'Plant not found',
        details: 'No plant found with this ID'
      })
    }
      const plantinfo = await PlantInfo.findOne({perenualId: plant.plantType})
      const myPlant = {
        result: plantinfo
      }
      return myPlant
      
    } catch (error) {
      throw {
        status: 400,
        msg: 'Invalid ID type',
        details: 'Plant_id must be type: mongoose.Types.ObjectId'
      }
    }
}
