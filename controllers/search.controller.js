exports.postPlantBySearch = (request, response, next) =>{
const {search} = request.body

createPlantBySearch(search)
.then((plant)=>{
    response.status(200).send({result: plant})
})
.catch(next)
}
