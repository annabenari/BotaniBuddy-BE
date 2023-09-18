const mongoose = require("../connection");

const plantInfoSchema = new mongoose.Schema({
  commonName: String,

  scientificName: String,

  maxHeight: Number,

  wateringFrequency: String,

  wateringPeriod: {
    value: String,
    unit: String,
  },

  sunglight: String,

  pruningMonth: Array,

  pruningCount: {
    amount: Number,
    interval: String,
  },

  maintenance: String,

  poisonousToHumans: Boolean,

  poisonousToPets: Boolean,

  rareLevel: Number,

  indoor: Boolean,

  description: String,
});

const usersSchema = new mongoose.Schema({
  username: String,

  password: String,

  plants: [mongoose.Schema.Types.ObjectId],
});

const plantsSchema = new mongoose.Schema({
  tasks: mongoose.Schema.Types.Mixed,

  users: [mongoose.Schema.Types.ObjectId],

  plantType: mongoose.Schema.Types.ObjectId,
});

module.exports = { plantInfoSchema, usersSchema, plantsSchema };
