const { fetchPlants } = require("../models/plants.model")

exports.getPlants = (request, response, next) => {
    const {user_id} = request.params
    
    fetchPlants(user_id)
    .then((result)=> {
        response.status(200).send({myPlants: result})
    })
    .catch(next)

}