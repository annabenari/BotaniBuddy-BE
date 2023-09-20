const { use } = require('../app')
const {createUser} = require('../models/login.model')

exports.postUser = (request, response, next) => {
    const {username, password} = request.body
    
    createUser(username, password)
    .then((result)=> {
        response.status(201).send({user: result})
    })
    .catch(next)

}


