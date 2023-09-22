const app = require("../app");
const database = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const mongoose = require("mongoose");
const testData = require("../db/data/test-data/index");
const { usersSchema } = require("../db/seeds/models");

beforeEach(async () => {
  await seed(testData);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/register allows a user to register on the app", () => {
  test("Status 201: responds with created user ", () => {
    return request(app)
      .post("/api/register")
      .send({
        username: "Chris",
        password: "bananas",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.user).toHaveProperty("user_id", expect.any(String));
        expect(body.user).toHaveProperty("username", "Chris");
        expect(body.user).toHaveProperty("password", expect.any(String));
        expect(body.user.password).not.toEqual("bananas");
      });
  }),
    test("Status 400: user does not give all required fields - no username is provided ", () => {
      return request(app)
        .post("/api/register")
        .send({
          password: "apples",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
          expect(body.detail).toBe("Path `username` is required.");
        });
    }),
    test("Status 400: user does not give all required fields - no password is provided", () => {
      return request(app)
        .post("/api/register")
        .send({
          username: "Ruby",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
          expect(body.detail).toBe("Password not provided");
        });
    });
  test("Status 400: user already exists", () => {
    return request(app)
      .post("/api/register")
      .send({
        username: "david_wilson",
        password: "mysecret",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.detail).toBe("User already exists");
      });
  });
});

describe("POST /api/login allows a user to login on the app", () => {
  test("Status 200: responds with sucessful login message", () => {
    return request(app)
      .post("/api/register")
      .send({
        username: "Chris",
        password: "bananas",
      })
      .then(() => {
        return request(app)
          .post("/api/login")
          .send({
            username: "Chris",
            password: "bananas",
          })
          .expect(200);
      })
      .then(({ body }) => {

       

        expect(body.user.msg).toBe("Login succesful");
        expect(body.user.username).toBe("Chris");
        expect(body.user).toHaveProperty("user_id", expect.any((String)));
      });
  });

  test("Status 400: responds with error when given incorrect password", ()=>{
    return request(app)
    .post("/api/register")
    .send({
      username: "Chris",
      password: "bananas",
    })
    .then(() => {
      return request(app)
        .post("/api/login")
        .send({
          username: "Chris",
          password: "HELLO",
        })
        .expect(400);
    })
    .then(({body})=>{
        
        expect(body.msg).toBe("Bad request")
        expect(body.detail).toBe("Password does not match")
    })
  })
  test("Status 404: no user found", ()=>{
    return request(app)
        .post("/api/login")
        .send({
          username: "UNKNOWNUSER",
          password: "HELLO",
        })
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Not Found")
            expect(body.detail).toBe("No user found with this username")
        })
  })  

  test("Status 400: bad request - invalid input - no username", ()=>{
    return request(app)
        .post("/api/login")
        .send({
          password: "HELLO",
        })
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
            expect(body.detail).toBe("Invalid Input")
        })
  })  
  test("Status 400: bad request - invalid input - no password", ()=>{
    return request(app)
        .post("/api/login")
        .send({
        username: "Chris",
        })
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
            expect(body.detail).toBe("Invalid Input")
        })
  })  
});

describe("GET /api/users/:user_id/plants to return owned plants", ()=>{
  test("Status 200: responds with owned plants", async () => {
    const Users = await mongoose.model("users", usersSchema);
   return Users.findOne()
    .then((result) => {
            return request(app)
                .get(`/api/users/${result._id}/plants`)
                .expect(200)
                .then((response) => {
                    expect(JSON.stringify(response.body.myPlants)).toBe(JSON.stringify(result.plants))
                })
                })
    
  })

  test('Status 200: responds with an empty array when owned plants is empty', () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.findOne({username: "billy-bean12"})
    .then((result) => {
      return request(app)
        .get(`/api/users/${result._id}/plants`)
        .expect(200)
        .then((response) => {
          expect(response.body.myPlants).toHaveLength(0);
        })
    })
  });

  test('Status 404: responds with an error when user doesnt exist', () => {
    const madeUpId = new mongoose.Types.ObjectId("619d5ee25e7410e6270ce598")
    return request(app)
    .get(`/api/users/${madeUpId}/plants`)
    .expect(404)
    .then((response) => {
        expect(response.body.msg).toBe('Not Found')
    })
  });
})

describe("GET /api/users/:user_id/plants/:plant_id to return specific user's plant", () => {
  test("Status 200: responds with full description of plant", () => {
    const Users = mongoose.model("users", usersSchema);
    
    return Users.findOne({username: "jane_smith"})
      .then((result) => {
        return request(app)
          .get(`/api/users/${result.id}/plants/${result.plants[0]}`)
          .expect(200)
          .then((response) => {
            expect(response.body.myPlant).toHaveProperty('commonName')
            expect(response.body.myPlant).toHaveProperty('description')
            expect(response.body.myPlant).toHaveProperty('indoor')
            expect(response.body.myPlant).toHaveProperty('wateringPeriod')
            expect(response.body.myPlant).toHaveProperty('poisonousToHumans')
            expect(response.body.myPlant).toHaveProperty('poisonousToPets')
          })
      })
  })

  test('Status 404: responds with error when plant_id doesnt exist', () => {
    const Users = mongoose.model("users", usersSchema);
    const madeUpId = new mongoose.Types.ObjectId("619d5ee25e7410e6270ce598")
    return Users.findOne({username: "jane_smith"})
      .then((result) => {
        return request(app)
          .get(`/api/users/${result.id}/plants/${madeUpId}`)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Plant not found')
          })
      })
  });

  test('Status 400: responds with error when given invalid plant_id type', () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.findOne({username: "jane_smith"})
      .then((result) => {
        return request(app)
          .get(`/api/users/${result.id}/plants/nonesense`)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Invalid ID type')
          })
      })
  });

  test("Status 404: responds with an error when accessing a user that does not exist", () => {
    const Users = mongoose.model("users", usersSchema);
    const madeUpId = new mongoose.Types.ObjectId("619d5ee25e7410e6270ce598")
    
    return Users.findOne({username: "jane_smith"})
      .then((result) => {
        return request(app)
          .get(`/api/users/${madeUpId}/plants/${result.plants[0]}`)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('User not found')
          })
      })
  })

  test("Status 400: responds with an error when invalid type is given for user_id", () => {
    const Users = mongoose.model("users", usersSchema);
    
    return Users.findOne({username: "jane_smith"})
      .then((result) => {
        return request(app)
          .get(`/api/users/nonsense/plants/${result.plants[0]}`)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Invalid ID type')
          })
      })
  })
})