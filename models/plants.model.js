const mongoose = require("mongoose");
const { usersSchema, plantInfoSchema, plantsSchema } = require("../db/seeds/models");


exports.fetchPlants = (user_id) =>{
    const Users = mongoose.model("users", usersSchema);
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

exports.fetchSpecificPlant = async (plant_id) => {
  const Plants = await mongoose.model("Plants", plantsSchema)
  const PlantInfo = await mongoose.model('PlantInfo', plantInfoSchema)

  try{
    const plant = await Plants.findById(plant_id)
    console.log(plant, 'in model')

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
      console.log(plantinfo, 'in model plant info')
      return myPlant
    } catch (error) {
      console.log('its me')
      Promise.reject({
        status: 400,
        msg: 'Invalid ID type',
        details: 'Plant_id must be type: mongoose.Types.ObjectId'

      })
    }
}
