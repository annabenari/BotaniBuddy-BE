const mongoose = require("mongoose");
const axios = require("axios");
const dayjs = require("dayjs");

const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);

const {
  usersSchema,
  plantInfoSchema,
  plantsSchema,
} = require("../db/seeds/models");

exports.fetchTasks = (user_id) => {
  const Users = mongoose.model("Users", usersSchema);
  const Plants = mongoose.model("Plants", plantsSchema);
  const PlantInfo = mongoose.model("PlantInfo", plantInfoSchema);
  return Users.findById(user_id)
    .then(async (user) => {
      const tasksToDo = [];

      if (user === null) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
          details: "No user found with this username",
        });
      }
      const myPlants = user.plants;

      for (let i = 0; i < myPlants.length; i++) {
        const plant = await Plants.findById(myPlants[i]);
        const tasks = plant.tasks;
        const plantName = await PlantInfo.findOne(
          { perenualId: plant.plantType },
          "commonName"
        );
        if (dayjs().isSameOrAfter(tasks.toBeWateredAgain)) {
          console.log("hello");
          tasksToDo.push({ plantName, task: tasks, plantId: plant._id });
        }
      }
      console.log(tasksToDo, "task2do");
      return tasksToDo;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
