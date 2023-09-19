const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const {postUser} = require('./controllers/login.controller')

const app = express();

app.use(cors());

app.use(express.json());

app.post("/api/register", (postUser))


module.exports = app;
