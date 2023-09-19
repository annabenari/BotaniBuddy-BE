const database = require('./db/connection')
const express = require("express");
const cors = require("cors");
const {postUser} = require('./controllers/login.controller')

const app = express();
database()

app.use(cors());
app.use(express.json());

app.post("/api/register", (postUser))


module.exports = app;
