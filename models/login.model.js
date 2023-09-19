const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")


exports.createUser = (username, password) => {

    console.log(username, password, "in model")

   return bcrypt.hash(password, 10)
  .then((hashedPassword)=> {

     console.log(hashedPassword)

     const users = mongoose.Schema("users")

     const usersLogged = async () => { 
        await users.find()
    }
     console.log(usersLogged())

  })
  .catch()
}


// Define schema
// const Schema = mongoose.Schema;

// const SomeModelSchema = new Schema({
//   a_string: String,
//   a_date: Date,
// });

// // Compile model from schema
// const SomeModel = mongoose.model("SomeModel", SomeModelSchema);