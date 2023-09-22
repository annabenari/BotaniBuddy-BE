const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const { postUser, postLogin } = require("./controllers/login.controller");
const { mongoErrors, customErrors } = require("./errors/errors");
const { getHello } = require("./controllers/getHello.controller");

const app = express();
const PORT = process.env.PORT || 9090;
const MONGO_URI = process.env.MONGO_URI;

app.use(mongoSanitize());
app.use(cors());
app.use(express.json());

app.post("/api/register", postUser);
app.post("/api/login", postLogin);
app.get("/api", getHello);

app.use((request, response) => {
  response.status(404).send({ msg: "Not found" });
});

app.use(mongoErrors);
app.use(customErrors);

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}...`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connectDB();
