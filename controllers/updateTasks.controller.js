const { patchTasks } = require("../models/updateTasks.model");

exports.updateTasks = (request, response, next) => {
    
    const {user_id, plant_id} = request.params
    console.log(user_id, plant_id);

    patchTasks(user_id, plant_id)
    .then((nextWaterDate) => {
        console.log(nextWaterDate, "in controller")
        response.status(200).send({nextWaterDate})
    })
    .catch(next)
}