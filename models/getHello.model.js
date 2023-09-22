const mongoose = require("mongoose");
const { usersSchema } = require("../db/seeds/models");


exports.fetchHello = () => {
    const Users = mongoose.model("users", usersSchema);
return Users.findOne().then((result) => {
    const test = {test: result }
return  test 
})
    .catch((err) => Promise.reject(err));
};
