require("dotenv").config({ path: `${__dirname}/../.env.keys` });

const { PERENUAL_KEY, PLANTNET_KEY } = process.env;

if (!PERENUAL_KEY) {
    throw new Error("no PERENUAL_KEY env variable set");
  }

if (!PLANTNET_KEY) {
    throw new Error("no PLANTNET_KEY env variable set");
}

module.exports = {
    PERENUAL_KEY,
    PLANTNET_KEY,
}