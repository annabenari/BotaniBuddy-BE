exports.mongoErrors = ((error, request, response, next) => {

    if(error){
        
        response.status(400).send({
            msg: 'Bad request',
            detail: error._message
        })

     
    }
})