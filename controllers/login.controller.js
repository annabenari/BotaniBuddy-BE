const {createUser, createLogin} = require('../models/login.model')

exports.postUser = (request, response, next) => {
    const {username, password} = request.body
    
    createUser(username, password)
    .then((result)=> {
        response.status(201).send({user: result})
    })
    .catch(next)

}

exports.postLogin = (request, response, next) =>{
    const {username, password} = request.body

    createLogin(username, password)
    .then((result)=>{
        response.status(200).send({user: result})
    })
    .catch(next)
}
