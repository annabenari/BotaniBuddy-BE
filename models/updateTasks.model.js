const mongoose = require("mongoose");
const { plantsSchema, plantInfoSchema } = require("../db/seeds/models");
const dayjs = require("dayjs");

exports.patchTasks = (plant_id) => {
  const Plants = mongoose.model("plants", plantsSchema);
  const PlantsInfo = mongoose.model("PlantInfo", plantInfoSchema);

  // get peruneal Id of given plant
  return (
    Plants.findById(plant_id)
      .then((currentPlant) => {
        if (currentPlant === null) {
          return Promise.reject({
            status: 400,
            msg: "Bad Request",
            details: "Invalid Plant ID",
          });
        } else {
          return currentPlant.plantType;
        }
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
        .then((plantNewDate) => {
          plantNewDate.tasks.toBeWateredAgain = dayjs()
            .add(valueUntilWatering, unitUntilWatering)
            .format("DD-MM-YYYY");

          const update = {
            tasks: { toBeWateredAgain: plantNewDate.tasks.toBeWateredAgain },
          };

          const filter = { _id: plant_id };

          return Plants.findOneAndUpdate(filter, update, {
            new: true,
          }).then((updatedPlant) => {
            return updatedPlant;
          });
        });
      })
      .catch((err) => {
        return Promise.reject(err);
      })
  );
};
