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
  const Users = mongoose.model("users", usersSchema);

  Users.findOne({username: "david_wilson"}).then((result) => {
    console.log(result, "result")
  })

  Users.findOne({username}).then((user)=>{
    console.log(username, "username")
    console.log(user, "user")
    bcrypt
    .compare(password, user.password).then((passwordCheck)=>{
      console.log(`**${password}**, **${user.password}**`)
      console.log(passwordCheck)
      if(!passwordCheck){
        console.log("I'm false")
        return Promise.reject({
          status: 400,
          msg: "Bad request", 
          details: "Password does not match"
        }) 
      }
      const token = jwt.sign({user_id: user._id, username: user.username}, "RANDOM-TOKEN", {expiresIn: "24h"})
      return {
        msg: "Login succesful",
        username: user.username,
        token
      }
    })
    .catch((err) => Promise.reject(err));
  })
  .catch((err) => Promise.reject(err));
}