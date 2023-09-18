const mongoose = require("../connection");
const { plantInfoSchema, usersSchema, plantsSchema } = require("./models");

async function seed() {
  const PlantInfo = mongoose.model("PlantInfo", plantInfoSchema);
  const Users = mongoose.model("Users", usersSchema);
  const Plants = mongoose.model("Plants", plantsSchema);
}

seed().then(() => {
  mongoose.connection.close();
});

module.exports = seed;
