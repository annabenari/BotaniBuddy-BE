const {
  createPlantBySearch,
  returnIdentifiedImage,
} = require("../models/search.model");

exports.postPlantBySearch = (request, response, next) => {
  const { name } = request.body;
  const { user_id } = request.params;

  createPlantBySearch(name, user_id)
    .then((plant) => {
      response.status(201).send({ plant });
    })
    .catch(next);
};

exports.postIdentificationRequest = (request, response, next) => {
  let buffer;
  try {
    buffer = request.file.buffer;
  } catch {
    const body = {
      msg: "Bad request",
      detail: "Invalid body",
    };
    response.status(400).send(body);
  }
  const { user_id } = request.params;
  returnIdentifiedImage(buffer, user_id)
    .then(({ score, plantName }) => {
      response.status(201).send({ score, plantName });
    })
    .catch(next);
};
