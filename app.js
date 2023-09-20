const database = require('./db/connection')
const express = require("express");
const cors = require("cors");
const {postUser} = require('./controllers/login.controller')
const {mongoErrors} = require('./errors/errors')

const app = express();
database()

app.use(cors());
app.use(express.json());

app.post("/api/register", (postUser))


app.use((request, response)=> {
    response.status(404).send({msg: "Not found"})
})

app.use(mongoErrors)


module.exports = app;
