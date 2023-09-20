exports.mongoErrors = ((error, request, response, next) => {

    if(error.errors){

        console.log(error, "in error handler")
        
        response.status(400).send({
            msg: 'Bad request',
            detail: error.errors.username.properties.message
        })

     
    }
})


exports.customErrors = ((error, request, response, next) => {

    console.log("in customErrors")

    if(error){
        console.log(error)
    }

})