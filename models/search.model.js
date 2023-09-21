const mongoose = require("mongoose");
const axios = require("axios")
const {plantInfoSchema} = require('../db/seeds/models')


exports.createPlantBySearch =  async (name, user_id) => {

     const PlantInfo = await mongoose.model("plantinfo", plantInfoSchema)

        return axios.get(`https://perenual.com/api/species-list?key=sk-Zzn7650c218d729af2240&q=${name}`)
        .then(async ({data}) => {

            if(PlantInfo.find({"perenualId" : data.data[0].id}).length === 1){
                const plantID = await PlantInfo.find({"perenualId" : data.data[0].id})
                console.log(plantID)
            }
            else{ 
                //if empty array []  
            }
            
            return data
        })
      
        .catch((error) => {
            return error
        })
}


  




  


    // check if plant already in PlantInfo
    // if not exists, add info to PlantInfo
    // if does exist, do nothing
    // add new plant to Plants 
    // add that user's ID into the Plants array
    // respond with new Plant
    // update user table with person's plants

