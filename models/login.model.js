const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { usersSchema } = require("../db/seeds/models");

exports.createUser = (username, password) => {

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {

      const Users = mongoose.model("users", usersSchema)

      const user = new Users({
         
         username: username,
         password: hashedPassword
      })
      
      return user.save()
    }).then((savedUser) => {

      const userToReturn = {
         user_id: savedUser._id,
         username: savedUser.username,
         password: savedUser.password
      }

      return userToReturn
    })
    .catch((err) => Promise.reject(err));
};
