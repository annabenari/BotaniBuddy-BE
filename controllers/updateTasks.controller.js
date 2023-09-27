const {patchTask}= require('../models/updateTasks.model')

exports.updateTasks = (request, response, next) => {

    const {plant_id} = request.body
    console.log(plant_id, "in controller")

    patchTask(user_id, plant_id)
    .then((response) => {
        console.log(response, "in controller")
        response.status(200).send({nextWaterDate: response})
    })
    .catch(next)
}