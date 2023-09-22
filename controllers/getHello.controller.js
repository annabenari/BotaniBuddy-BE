const { fetchHello } = require("../models/getHello.model");

exports.getHello = (request, response, next) => {
  fetchHello()
    .then((result) => {
      response.status(201).send("hello");
    })
    .catch(next);
};
