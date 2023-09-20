const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { usersSchema } = require("../db/seeds/models");

exports.createUser = (username, password) => {

  if(password === undefined){
    return Promise.reject({
      status: 400,
      msg: "Bad request", 
      details: "Password not provided"
  })
  }

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

exports.createLogin = (username, password) =>{
  const Users = mongoose.model("users", usersSchema)

  Users.findOne({username}).then((user)=>{
    bycrpt
    .compare(password, user.password).then((passwordCheck)=>{
      if(!passwordCheck){
        return Promise.reject({
          status: 400,
          msg: "Bad request", 
          details: "Password does not match"
      }) 
      }


    })
  })
console.log("inside model");

}