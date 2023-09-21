const {createPlantBySearch} = require("../models/search.model")

exports.postPlantBySearch = (request, response, next) =>{

const {name} = request.body
const {user_id} = request.params

createPlantBySearch(name, user_id)
.then((plant)=>{

    response.status(201).send({result: plant})
})
.catch(next)
}
