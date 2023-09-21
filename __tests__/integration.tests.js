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
        expect(body.user).toHaveProperty("user_id", expect.any(String));
      });
  });

  test("Status 400: responds with error when given incorrect password", () => {
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
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.detail).toBe("Password does not match");
      });
  });
  test("Status 404: no user found", () => {
    return request(app)
      .post("/api/login")
      .send({
        username: "UNKNOWNUSER",
        password: "HELLO",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
        expect(body.detail).toBe("No user found with this username");
      });
  });

  test("Status 400: bad request - invalid input - no username", () => {
    return request(app)
      .post("/api/login")
      .send({
        password: "HELLO",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
        expect(body.detail).toBe("Invalid Input");
      });
  });
  test("Status 400: bad request - invalid input - no password", () => {
    return request(app)
      .post("/api/login")
      .send({
        username: "Chris",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
        expect(body.detail).toBe("Invalid Input");
      });
  });
});

describe.only("POST /api/users/:user_id/add_by_search allows a user to add a plant they have searched for", () => {
  test("Status 201: creates a new plant in user's plants", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 1 }).then(([user]) => {
      return request(app)
        .post(`/api/users/${user._id}/add_by_search`)
        .send({ name: "European Silver Fir" })
        .expect(201)
        .then(({ body: { plant } }) => {
          expect(plant).toHaveProperty("_id", expect.any(String));
          expect(plant).toHaveProperty("tasks", expect.any(Object));
          expect(plant).toHaveProperty(
            "users",
            expect.arrayContaining([user._id])
          );
          expect(plant).toHaveProperty("plantType", expect.any(String));
        });
    });
  });
});
