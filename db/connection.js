const mongoose = require("mongoose")

const ENV = process.env.NODE_ENV || "development"

require("dotenv").config({path: `${__dirname}/../.env.${ENV}`})

const {URL} = process.env

console.log(URL)

if (!URL) {
  throw new Error("no URL env variable set")
}

async function connection () {
  console.log("before connection")
  await mongoose.connect(URL)
  console.log("after connection")
}

module.exports = connection