const mongoose = require("mongoose");

const plantInfoSchema = new mongoose.Schema({
  perenualId: Number,

  commonName: String,
  scientificName: String,

  maxHeight: String,

  wateringFrequency: String,

  wateringPeriod: {
    value: {type: String, default: "7"},
    unit: {type: String, default: "days"},
  },

  sunlight: Array,

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
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  plants: [mongoose.Schema.Types.ObjectId],
});

const plantsSchema = new mongoose.Schema({
  tasks: mongoose.Schema.Types.Mixed,
  users: [mongoose.Schema.Types.ObjectId],
  plantType: Number,
});

module.exports = { plantInfoSchema, usersSchema, plantsSchema };
