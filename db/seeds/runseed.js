const devData = require('../data/development-data')
const seed = require('./seed');
const mongoose = require("mongoose");

const runSeed = async () => {
await seed(devData);

//closes connection after running seed
await mongoose.connection.close();

};

runSeed();

