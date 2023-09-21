const { fetchPlants } = require("../models/plants.model")

exports.getPlants = (request, response, next) => {
    const {search} = request.body
    const {userID} = request.params
    
    fetchPlants(search, userID)
    .then((result)=> {
        response.status(201).send({myPlants: result})
    })
    .catch(next)

}