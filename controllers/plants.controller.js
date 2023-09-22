const { fetchPlants, fetchSpecificPlant } = require("../models/plants.model")

exports.getPlants = (request, response, next) => {
    const {user_id} = request.params
    
    fetchPlants(user_id)
    .then(({result})=> {
        response.status(200).send({myPlants: result})
    })
    .catch(next)

}

exports.getSpecificPlant = (request, response, next) => {
    const {user_id, plant_id} = request.params

    fetchSpecificPlant(user_id, plant_id)
    .then(({result}) => {
        reponse.status(200).send({myPlant: result})
    })
    .catch(next)
}