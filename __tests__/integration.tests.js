const app = require('../app')
const database = require('../db/connection')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const mongoose = require("mongoose");
const testData = require('../db/data/test-data/index')


beforeEach( async () => {
   await seed(testData)
})

afterAll( async ()=> {
   await mongoose.connection.close();
})

describe('POST /api/register allows a user to register on the app', ()=> {
    test('Status 201: responds with created user ', ()=> {

        return request(app)
        .post("/api/register")
        .send({
            "username": "Chris",
            "password": "bananas"
        })
        .expect(201)
        .then(({body}) => {

            console.log(body)

           expect(body.user).toHaveProperty("username", "Chris")
           expect(body.user).toHaveProperty("password", expect.any(String))
           expect(body.user.password).not.toEqual("bananas")
           
        })
    })
})


