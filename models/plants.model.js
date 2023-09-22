const mongoose = require("mongoose");
const { usersSchema } = require("../db/seeds/models");

exports.fetchPlants = (user_id) => {
  const Users = mongoose.model("users", usersSchema);
  return Users.findById(user_id)
    .then((user) => {
      if (user === null) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
          details: "No user found with this username",
        });
      }
      const myPlants = {
        result: user.plants,
      };

      return myPlants;
    })
    .catch((err) => Promise.reject(err));
};
