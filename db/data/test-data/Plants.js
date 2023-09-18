const mongoose = require("mongoose");

const Plants = [
  {
    tasks: {
      task1: "Water the plant",
      task2: "Prune the leaves",
    },
    users: [],
    plantType: new mongoose.Types.ObjectId(),
  },

  {
    tasks: {
      task1: "Fertilize the soil",
      task2: "Rotate the pot",
    },
    users: [],
    plantType: new mongoose.Types.ObjectId(),
  },

  {
    tasks: {
      task1: "Provide support",
      task2: "Harvest the flowers",
    },
    users: [],
    plantType: new mongoose.Types.ObjectId(),
  },

  {
    tasks: {
      task1: "Monitor for pests",
      task2: "Repot when needed",
    },
    users: [],
    plantType: new mongoose.Types.ObjectId(),
  },
];

module.exports = Plants;
