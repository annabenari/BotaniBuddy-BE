const mongoose = require("mongoose");
const { plantsSchema, plantInfoSchema } = require("../db/seeds/models");
const dayjs = require("dayjs");

exports.patchTasks = (user_id, plant_id) => {
  const Plants = mongoose.model("plants", plantsSchema);
  const PlantsInfo = mongoose.model("PlantInfo", plantInfoSchema);

  // get peruneal Id of given plant
  return (
    Plants.findById(plant_id)
      .then((currentPlant) => {
        return currentPlant.plantType;
      })
      // get watering frequency from plant info using perunal ID
      .then((perenualIdValue) => {
        return PlantsInfo.find({ perenualId: perenualIdValue });
      })
      .then((plantInfo) => {
        const valueUntilWatering =
          plantInfo[0].wateringPeriod.value.match(/\d+/)[0];
        const unitUntilWatering = plantInfo[0].wateringPeriod.unit;
        return { valueUntilWatering, unitUntilWatering };
      })
      .then(({ valueUntilWatering, unitUntilWatering }) => {

        return Plants.findById(plant_id)

        .then((plantNewDate)=> {

            //define new water date (today + 7)
           plantNewDate.tasks.toBeWateredAgain = dayjs().add(valueUntilWatering, unitUntilWatering).format("DD-MM-YYYY")
           
            return plantNewDate
        })

      })
  );

};
