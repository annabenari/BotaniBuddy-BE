const mongoose = require("mongoose");

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

// const connectDB = async () => {
//     try {
//       const conn = await mongoose.connect(process.env.MONGO_URI);
//       console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//       console.log(error);
//       process.exit(1);
//     }
//   }

module.exports = connection;
