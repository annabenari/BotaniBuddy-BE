const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { usersSchema } = require("../db/seeds/models");

exports.createUser = (username, password) => {
  console.log(username, password, "in model");

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      console.log(hashedPassword);

      const Users = mongoose.model("users", usersSchema)

      const user = new Users({
         username: username,
         password: hashedPassword
      })
      
      return user.save()
    }).then((savedUser) => {
      const userToReturn = {
         username: savedUser.username,
         password: savedUser.password
      }
      return userToReturn
    })
    .catch((err) => console.log(err));
};

// Define schema
// const Schema = mongoose.Schema;

// const SomeModelSchema = new Schema({
//   a_string: String,
//   a_date: Date,
// });

// // Compile model from schema
// const SomeModel = mongoose.model("SomeModel", SomeModelSchema);
