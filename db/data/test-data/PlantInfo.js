const mongoose = require("mongoose")

const PlantInfo = [
  {
    commonName: "Lavender",
    scientificName: "Lavandula",
    maxHeight: 60,
    wateringFrequency: "Moderate",
    wateringPeriod: {
      value: "3",
      unit: "days",
    },
    sunglight: "Full sun",
    pruningMonth: ["May", "August"],
    pruningCount: {
      amount: 1,
      interval: "month",
    },
    maintenance: "Low",
    poisonousToHumans: false,
    poisonousToPets: false,
    rareLevel: 2,
    indoor: true,
    description: "A fragrant herb used in aromatherapy and culinary dishes.",
  },

  {
    commonName: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    maxHeight: 36,
    wateringFrequency: "Low",
    wateringPeriod: {
      value: "2",
      unit: "weeks",
    },
    sunglight: "Low to bright indirect light",
    pruningMonth: ["N/A"],
    pruningCount: {
      amount: 0,
      interval: "days",
    },
    maintenance: "Very low",
    poisonousToHumans: true,
    poisonousToPets: true,
    rareLevel: 1,
    indoor: true,
    description: "An easy-to-care-for houseplant known for air purification.",
  },

  {
    commonName: "Sunflower",
    scientificName: "Helianthus annuus",
    maxHeight: 120,
    wateringFrequency: "Regular",
    wateringPeriod: {
      value: "1",
      unit: "day",
    },
    sunglight: "Full sun",
    pruningMonth: ["July", "September"],
    pruningCount: {
      amount: 1,
      interval: "month",
    },
    maintenance: "Moderate",
    poisonousToHumans: false,
    poisonousToPets: false,
    rareLevel: 2,
    indoor: false,
    description:
      "A tall, bright yellow flower known for following the sun's path.",
  },

  {
    commonName: "Ficus Tree",
    scientificName: "Ficus elastica",
    maxHeight: 96,
    wateringFrequency: "Low to moderate",
    wateringPeriod: {
      value: "10",
      unit: "days",
    },
    sunglight: "Bright indirect light",
    pruningMonth: ["N/A"],
    pruningCount: {
      amount: 0,
      interval: "days",
    },
    maintenance: "Moderate",
    poisonousToHumans: true,
    poisonousToPets: true,
    rareLevel: 2,
    indoor: true,
    description: "A popular indoor tree with glossy green leaves.",
  },
];

module.exports = PlantInfo