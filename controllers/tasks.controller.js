const { fetchTasks } = require("../models/tasks.model");
exports.getTasks = (request, response, next) => {
  const { user_id } = request.params;

  fetchTasks(user_id)
    .then((tasks) => {
      response.status(200).send({ tasks });
    })
    .catch(next);
};
