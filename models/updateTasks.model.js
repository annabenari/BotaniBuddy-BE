const mongoose = require("mongoose");
const { plantsSchema, plantInfoSchema } = require("../db/seeds/models");

exports.patchTasks = (user_id, plant_id) => {
  const Plants = mongoose.model("plants", plantsSchema);
  const PlantsInfo = mongoose.model("PlantInfo", plantInfoSchema);

  // get peruneal Id of given plant
  return Plants.findById(plant_id)
    .then((currentPlant) => {
      return currentPlant.plantType;
    })
    // get watering frequency from plant info using perunal ID
    .then((perenualIdValue) => {
      return PlantsInfo.find({ perenualId: perenualIdValue});
    }).then((plantInfo)=>{
        
        const valueUntilWatering = plantInfo[0].wateringPeriod.value.match(/\d+/)[0];
        const unitUntilWatering = plantInfo[0].wateringPeriod.unit;
       return ({valueUntilWatering, unitUntilWatering});
    }).then(({valueUntilWatering, unitUntilWatering})=>{
        console.log(valueUntilWatering, unitUntilWatering);
    })

  // update plants table, tasks with the current date + period
};
