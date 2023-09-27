const { patchTasks } = require("../models/updateTasks.model");

exports.updateTasks = (request, response, next) => {
    
    const {plant_id} = request.params

    patchTasks(plant_id)
    .then((nextWaterDate) => {
        response.status(200).send({nextWaterDate})
    })
    .catch(next)
}