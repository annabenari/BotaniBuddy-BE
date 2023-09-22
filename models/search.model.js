const mongoose = require("mongoose");
const axios = require("axios")
const {plantInfoSchema, plantsSchema, usersSchema} = require('../db/seeds/models')
const dayjs = require("dayjs");
const { get } = require("../app");


exports.createPlantBySearch =  async (name, user_id) => {


    //Connect to tables
     const PlantInfo = await mongoose.model("plantinfo", plantInfoSchema)
     const Plants = await mongoose.model("plants", plantsSchema)
     const Users = await mongoose.model("users", usersSchema)


    //Make get request for base data
        return axios.get(`https://perenual.com/api/species-list?key=sk-Zzn7650c218d729af2240&q=${name}`)
        .then(async ({data}) => {
            const existsAlready =  await PlantInfo.find({"perenualId" : data.data[0].id})
            
            if(existsAlready.length===1){
                return existsAlready[0]
            }
            else{ 
                return axios.get(`https://perenual.com/api/species/details/${data.data[0].id}?key=sk-Zzn7650c218d729af2240`)
                .then(async ({data}) => {

                    // add to PlantInfos
                    const outputData = new PlantInfo ({
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
                          value: data.watering_general_benchmark.value,
                          unit: data.watering_general_benchmark.unit,
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
                      
                      return outputData.save()             
                })
               
            }
            
        })
        .then(async (plantInfoData) => {

            const getWateringPeriod = plantInfoData.wateringPeriod.value.match(/\d+/)[0]

            const wateringTime = plantInfoData.wateringPeriod.unit
    

            const insertIntoPlants = new Plants ({
                      tasks: {
                        tobeWateredAgain: dayjs().add(getWateringPeriod, wateringTime).format("DD-MM-YYYY")
                      } ,
                      users: [user_id],
                      plantType:plantInfoData.perenualId,
                    
            })

            console.log(insertIntoPlants, "insertIntoPlants")
            return insertIntoPlants.save()

        })
        .then(async (PlantsData) => {

            //asign plant to user in users table
            console.log(PlantsData._id)

            //get user
            const userToUpdate = await Users.findById(user_id)
            console.log(userToUpdate, "user to update")

            userToUpdate.plants.push(PlantsData._id)

            return userToUpdate.save()

        }).then(async (userUpdated) => {

            console.log(userUpdated, "updated User with plant")


            const latestPlant = userUpdated.plants[userUpdated.plants.length -1]
            console.log(latestPlant, "final plant in array")

            return Plants.findById(latestPlant)


        })
        .catch((error) => {
            console.log(error)
            return error
        })
}


    // check if plant already in PlantInfo = DONE
    // if does exist, do nothing - DONE
    // if does NOT exist, add to plant info - DONE
    // add new plant to Plants  - DONE
    // add that user's ID into the Plants array = DONE
    // update user table with person's plants - DONE

    // respond with new Plant



