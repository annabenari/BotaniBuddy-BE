exports.mongoErrors = ((error, request, response, next) => {
    if (error.code===11000){
        response.status(400).send({
            msg: 'Bad request',
            detail: "User already exists"
        })
    }
    if(error.errors){
        response.status(400).send({
            msg: 'Bad request',
            detail: error.errors.username.properties.message
        })
    } else{
        next(error)
    }
})


exports.customErrors = ((error, request, response, next) => {

    if(error){
        response.status(error.status).send({ msg: error.msg, detail: error.details})
    }

})