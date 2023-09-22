const mongoose = require("mongoose");
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`,
});

const { URL, DATABASE_URL, PGDATABASE } = process.env;

if (!URL) {
  throw new Error("No URL env variable set");
}

if (!DATABASE_URL && !PGDATABASE) {
  throw new Error("DATABASE_URL or PGDATABASE not set");
}

const config = {};

if (process.env.NODE_ENV === "production") {
  config.connectionString = DATABASE_URL;
  config.max = 2;
}

const pool = new Pool(config);

module.exports = pool;

async function connectToMongoDB() {
  await mongoose.connect(URL);
}

module.exports.connectToMongoDB = connectToMongoDB;
