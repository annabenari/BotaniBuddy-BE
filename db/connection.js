const mongoose = require("mongoose");


const ENV = process.env.NODE_ENV || "development";

const listen = require("../listen");

const ENV = process.env.URL || "development";


require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

const { URL } = process.env;

if (!URL) {
  throw new Error("no URL env variable set");
}

async function connection() {


  console.log("before connection");

  await mongoose.connect(URL);
  console.log("after connection");
}

module.exports = connection;
