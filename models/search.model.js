const mongoose = require("mongoose");
const axios = require("axios");
const {
  plantInfoSchema,
  plantsSchema,
  usersSchema,
} = require("../db/seeds/models");
const dayjs = require("dayjs");
const { get } = require("../app");

exports.createPlantBySearch = async (name, user_id) => {
  //Connect to tables
  const PlantInfo = await mongoose.model("plantinfo", plantInfoSchema);
  const Plants = await mongoose.model("plants", plantsSchema);
  const Users = await mongoose.model("users", usersSchema);

  if (name === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }

  //Make get request for base data
  return axios
    .get(
      `https://perenual.com/api/species-list?key=sk-Zzn7650c218d729af2240&q=${name}`
    )
    .then(async ({ data }) => {
      if (data.data.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Plant not found",
        });
      }

      const existsAlready = await PlantInfo.find({
        perenualId: data.data[0].id,
      });

      if (existsAlready.length === 1) {
        if (!existsAlready[0].wateringPeriod.value) {
          existsAlready[0].wateringPeriod.value = "7";
        }
        if (!existsAlready[0].wateringPeriod.unit) {
          existsAlready[0].wateringPeriod.unit = "days";
        }
        return existsAlready[0];
      } else {
        return axios
          .get(
            `https://perenual.com/api/species/details/${data.data[0].id}?key=sk-Zzn7650c218d729af2240`
          )
          .then(async ({ data }) => {
            // add to PlantInfos
            const outputData = new PlantInfo({
              perenualId: data.id,
              commonName: data.common_name,
              scientificName: data.scientific_name[0],
              maxHeight:
                data.dimensions.type === "Height" ||
                data.dimensions.type === "height"
                  ? `${data.dimensions.max_value} ${data.dimensions.unit}`
                  : "0 feet",
              wateringFrequency: data.watering,
              wateringPeriod: {
                value: data.watering_general_benchmark.value || "7",
                unit: data.watering_general_benchmark.unit || "days",
              },
              sunlight: data.sunlight,
              pruningMonth: data.pruning_month,
              pruningCount:
                Object.keys(data.pruning_count).length === 0
                  ? {}
                  : data.pruning_count,
              maintenance: data.maintenance || "None",
              poisonousToHumans: data.poisonous_to_humans,
              poisonousToPets: data.poisonous_to_pets,
              rareLevel: data.rare_level || 0,
              indoor: data.indoor,
              description: data.description,
            });

            return outputData.save();
          });
      }
    })
    .then(async (plantInfoData) => {
      const getWateringPeriod =
        plantInfoData.wateringPeriod.value.match(/\d+/)[0];

      const wateringTime = plantInfoData.wateringPeriod.unit;

      const insertIntoPlants = new Plants({
        tasks: {
          toBeWateredAgain: dayjs()
            .add(getWateringPeriod, wateringTime)
            .format("DD-MM-YYYY"),
        },
        users: [user_id],
        plantType: plantInfoData.perenualId,
      });
      return insertIntoPlants.save();
    })
    .then(async (PlantsData) => {
      //asign plant to user in users table
      const userToUpdate = await Users.findById(user_id);

      userToUpdate.plants.push(PlantsData._id);

      return userToUpdate.save();
    })
    .then(async (userUpdated) => {
      const latestPlant = userUpdated.plants[userUpdated.plants.length - 1];

      return Plants.findById(latestPlant);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

exports.returnIdentifiedImage = async (buffer, user_id) => {
  const Users = await mongoose.model("users", usersSchema);
  let user;
  try {
    user = await Users.findById(user_id);
  } catch {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
      details: "Invalid user id",
    });
  }
  if (!user) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
      details: "User does not exist",
    });
  }
  let formData;
  try {
    const arrayBuffer = new Uint8Array(buffer).buffer;
    const toSend = new File([arrayBuffer], "images");
    formData = new FormData();
    formData.append("images", toSend);
  } catch {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
      details: "Malformed body",
    });
  }
  return axios
    .post(
      "https://my-api.plantnet.org/v2/identify/all?api-key=2b10GLsEqAO1ADYfA8O1lgyO",
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      }
    )
    .then(({ data: { results } }) => {
      const score = results[0].score;
      const plantName = results[0].species.scientificNameWithoutAuthor;
      return { score, plantName };
    });
};
