exports.mongoErrors = (error, request, response, next) => {
  if (error.code === 11000) {
    response.status(400).send({
      msg: "Bad request",
      detail: "User already exists",
    });
  }
  if (error.errors) {
    response.status(400).send({
      msg: "Bad request",
      detail: error.errors.username.properties.message,
    });
  } else {
    next(error);
  }
};

exports.axiosErrors = (error, request, response, next) => {
  if (error.name === "AxiosError") {
    if (error.request.res.statusCode === 429) {
      response.status(400).send({
        msg: "Plant species outside of free range of Perenual",
      });
    } else if (error.response.data.message === "Species not found") {
      response.status(404).send({
        msg: "Not found",
        detail: error.response.data.message,
      });
    }
  } else {
    next(error);
  }
};

exports.customErrors = (error, request, response, next) => {
  
  if (!error.details) {
    error.details = "";
  }

  if (error) {
    response
      .status(error.status)
      .send({ msg: error.msg, detail: error.details });
  }
};
