const database = require("./db/connection");
const express = require("express");
const cors = require("cors");
const { postUser, postLogin } = require("./controllers/login.controller");
const { mongoErrors, customErrors } = require("./errors/errors");
const mongoSanitize = require("express-mongo-sanitize");
const { getHello } = require("./controllers/getHello.controller");

const app = express();
database();

app.use(mongoSanitize());

app.use(cors());
app.use(express.json());

app.post("/api/register", postUser);
app.post("/api/login", postLogin);
app.get("api", getHello);

app.use((request, response) => {
  response.status(404).send({ msg: "Not found" });
});

app.use(mongoErrors);
app.use(customErrors);

module.exports = app;
