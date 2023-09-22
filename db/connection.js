const mongoose = require("mongoose")

const ENV = process.env.URL || "development"

require("dotenv").config({path: `${__dirname}/../.env.${ENV}`})

const {URL} = process.env

if (!URL) {
  throw new Error("no URL env variable set")
}

async function connection () {
  await mongoose.connect(URL)
}

module.exports = connection