const app = require("../app");
const database = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const mongoose = require("mongoose");
const testData = require("../db/data/test-data/index");
const { usersSchema } = require("../db/seeds/models");
const formData = require("./assets/formData");
const formDataInvalidImage = require("./assets/formDataInvalidImage");
const { updateTasks } = require("../controllers/updateTasks.controller");
const Plants = require("../db/data/test-data/Plants");



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
describe("GET /api/users/:user_id/plants to return owned plants", () => {
  test("Status 200: responds with owned plants", async () => {
    const Users = await mongoose.model("users", usersSchema);
    return Users.findOne().then((result) => {
      return request(app)
        .get(`/api/users/${result._id}/plants`)
        .expect(200)
        .then((response) => {
          expect(JSON.stringify(response.body.myPlants)).toBe(
            JSON.stringify(result.plants)
          );
        });
    });
  });

  test("Status 200: responds with an empty array when owned plants is empty", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.findOne({ username: "billy-bean12" }).then((result) => {
      return request(app)
        .get(`/api/users/${result._id}/plants`)
        .expect(200)
        .then((response) => {
          expect(response.body.myPlants).toHaveLength(0);
        });
    });
  });

  test("Status 404: responds with an error when user doesnt exist", () => {
    const madeUpId = new mongoose.Types.ObjectId("619d5ee25e7410e6270ce598");
    return request(app)
      .get(`/api/users/${madeUpId}/plants`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/users/:user_id/plants/:plant_id to return specific user's plant", () => {
  test("Status 200: responds with full description of plant", () => {
    const Users = mongoose.model("users", usersSchema);

    return Users.findOne({ username: "jane_smith" }).then((result) => {
      return request(app)
        .get(`/api/users/${result.id}/plants/${result.plants[0]}`)
        .expect(200)
        .then((response) => {
          expect(response.body.myPlant).toHaveProperty("commonName");
          expect(response.body.myPlant).toHaveProperty("description");
          expect(response.body.myPlant).toHaveProperty("indoor");
          expect(response.body.myPlant).toHaveProperty("wateringPeriod");
          expect(response.body.myPlant).toHaveProperty("poisonousToHumans");
          expect(response.body.myPlant).toHaveProperty("poisonousToPets");
        });
    });
  });

  test("Status 404: responds with error when plant_id doesnt exist", () => {
    const Users = mongoose.model("users", usersSchema);
    const madeUpId = new mongoose.Types.ObjectId("619d5ee25e7410e6270ce598");
    return Users.findOne({ username: "jane_smith" }).then((result) => {
      return request(app)
        .get(`/api/users/${result.id}/plants/${madeUpId}`)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Plant not found");
        });
    });
  });

  test("Status 400: responds with error when given invalid plant_id type", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.findOne({ username: "jane_smith" }).then((result) => {
      return request(app)
        .get(`/api/users/${result.id}/plants/nonesense`)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid ID type");
        });
    });
  });

  test("Status 404: responds with an error when accessing a user that does not exist", () => {
    const Users = mongoose.model("users", usersSchema);
    const madeUpId = new mongoose.Types.ObjectId("619d5ee25e7410e6270ce598");

    return Users.findOne({ username: "jane_smith" }).then((result) => {
      return request(app)
        .get(`/api/users/${madeUpId}/plants/${result.plants[0]}`)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("User not found");
        });
    });
  });

  test("Status 400: responds with an error when invalid type is given for user_id", () => {
    const Users = mongoose.model("users", usersSchema);

    return Users.findOne({ username: "jane_smith" }).then((result) => {
      return request(app)
        .get(`/api/users/nonsense/plants/${result.plants[0]}`)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid ID type");
        });
    });
  });
});

describe("POST /api/users/:user_id/add_by_search allows a user to add a plant they have searched for", () => {
  test("Status 201: creates a new plant in user's plants for a plant that already exists in PlantInfos", () => {
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
            expect.arrayContaining([user._id.toString()])
          );
          expect(plant).toHaveProperty("plantType", expect.any(Number));
        });
    });
  });
  test("Status 201: plant does not already exist in PlantInfos and gets added", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 1 }).then(([user]) => {
      return request(app)
        .post(`/api/users/${user._id}/add_by_search`)
        .send({ name: "Pixie Japanese Maple" })
        .expect(201)
        .then(({ body: { plant } }) => {
          expect(plant).toHaveProperty("_id", expect.any(String));
          expect(plant).toHaveProperty("tasks", expect.any(Object));
          expect(plant).toHaveProperty(
            "users",
            expect.arrayContaining([user._id.toString()])
          );
          expect(plant).toHaveProperty("plantType", expect.any(Number));
        });
    });
  });
  test("Status 201: plant does exist but watering period is null", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 1 }).then(([user]) => {
      return request(app)
        .post(`/api/users/${user._id}/add_by_search`)
        .send({ name: "Fraser Fir" })
        .expect(201)
        .then(({ body: { plant } }) => {
          expect(plant).toHaveProperty("_id", expect.any(String));
          expect(plant).toHaveProperty("tasks", expect.any(Object));
          expect(plant).toHaveProperty(
            "users",
            expect.arrayContaining([user._id.toString()])
          );
          expect(plant).toHaveProperty("plantType", expect.any(Number));
        });
    });
  });
  test("Status 201: plant does exist but watering period unit (eg no days/months) is null", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 1 }).then(([user]) => {
      return request(app)
        .post(`/api/users/${user._id}/add_by_search`)
        .send({ name: "White Fir" })
        .expect(201)
        .then(({ body: { plant } }) => {
          expect(plant).toHaveProperty("_id", expect.any(String));
          expect(plant).toHaveProperty("tasks", expect.any(Object));
          expect(plant).toHaveProperty(
            "users",
            expect.arrayContaining([user._id.toString()])
          );
          expect(plant).toHaveProperty("plantType", expect.any(Number));
        });
    });
  });
  test("Status 404: plant not found eg wrong spelling", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 1 }).then(([user]) => {
      return request(app)
        .post(`/api/users/${user._id}/add_by_search`)
        .send({ name: "White Furry" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Plant not found");
        });
    });
  });
  test("Status 400: plant outside of free Perenual range (i.e. > 3000)", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 1 }).then(([user]) => {
      return request(app)
        .post(`/api/users/${user._id}/add_by_search`)
        .send({ name: "monstera" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Plant species outside of free range of Perenual");
        });
    });
  });
  test("Status 400: malformed body", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 1 }).then(([user]) => {
      return request(app)
        .post(`/api/users/${user._id}/add_by_search`)
        .send({ bananas: true })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });
});

describe("POST /api/users/:user_id/identify_plants_image finds the name of a plant by sending an image", () => {
  test("Status 201: returns name of a plant when given an image of the plant", async () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 1 }).then(([user]) => {
      return request(app)
        .post(`/api/users/${user._id}/identify_plants_image`)
        .set(
          "Content-Type",
          `multipart/form-data; boundary=${formData._boundary}`
        )
        .attach(
          "image",
          "__tests__/assets/Abies_alba_Mount_Auburn_Cemetery.jpg"
        )
        .expect(201)
        .then(({ body }) => {
          const { plantName, score } = body;
          expect(plantName).toBe("Abies alba");
          expect(score).toEqual(expect.any(Number));
        });
    });
  }, 10000);
  test("Status 400: should return invalid user id when given an invalid id", () => {
    return request(app)
      .post(`/api/users/1/identify_plants_image`)
      .set(
        "Content-Type",
        `multipart/form-data; boundary=${formData._boundary}`
      )
      .attach("image", "__tests__/assets/Abies_alba_Mount_Auburn_Cemetery.jpg")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.detail).toBe("Invalid user id");
      });
  });
  test("Status 400: should return invalid user id when given a user that doesn't exist", () => {
    return request(app)
      .post(`/api/users/65116a3770efda3e0b3cb53b/identify_plants_image`)
      .set(
        "Content-Type",
        `multipart/form-data; boundary=${formData._boundary}`
      )
      .attach("image", "__tests__/assets/Abies_alba_Mount_Auburn_Cemetery.jpg")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.detail).toBe("User does not exist");
      });
  });
  test("Status 400: returns Invalid body when sent malformed body", async () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 1 }).then(([user]) => {
      return request(app)
        .post(`/api/users/${user._id}/identify_plants_image`)
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
          expect(body.detail).toBe("Invalid body");
        });
    });
  });
  test("should return 404 species not found when sent an image of no plant", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 1 }).then(([user]) => {
      return request(app)
        .post(`/api/users/${user._id}/identify_plants_image`)
        .set(
          "Content-Type",
          `multipart/form-data; boundary=${formDataInvalidImage._boundary}`
        )
        .attach("image", "__tests__/assets/not_a_plant.jpg")
        .expect(404)
        .then(({ body }) => {
          const { msg, detail } = body;
          expect(msg).toBe("Not found");
          expect(detail).toBe("Species not found");
        });
    });
  }, 10000);
});

describe("GET users/user_id/tasks", () => {
  test("Gets all the tasks for one user", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 1 }).then(([user]) => {
      return request(app)
        .get(`/api/users/${user._id}/tasks`)
        .expect(200)
        .then(({ body }) => {
          const { tasks } = body;
          for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            expect(task).toHaveProperty("plantName");
            expect(task).toHaveProperty("plantID");
            expect(task).toHaveProperty("task");
          }
          expect(Array.isArray(tasks)).toBe(true);
        });
    });
  });
  test("Gets an empty array if passed a user with no tasks to do", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find({}, null, { limit: 3 }).then((users) => {
      return request(app)
        .get(`/api/users/${users[2]._id}/tasks`)
        .expect(200)
        .then(({ body }) => {
          const { tasks } = body;
          expect(tasks).toEqual([]);
        });
    });
  })
  test("Gets an empty array if passed a user with no plants", () => {
    const Users = mongoose.model("users", usersSchema);
    return Users.find().then((users) => {
      return request(app)
        .get(`/api/users/${users[4]._id}/tasks`)
        .expect(200)
        .then(({ body }) => {
          const { tasks } = body;
          expect(tasks).toEqual([]);
        })
    })
  })
  test("Status 400: should return invalid user id when given an invalid id", () => {
    return request(app)
      .get(`/api/users/1/tasks`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.detail).toBe("Invalid user id");
      });
  })
  test("Status 404: should return user not found when given a user that doesn't exist", () => {
    return request(app)
      .get(`/api/users/619d5ee25e7410e6270ce598/tasks`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
        expect(body.detail).toBe("User does not exist");
      });
  })
});
describe('PATCH - updates date plant needs to be watered when user clicks to confirm they have watered', ()=> {
  test('Status 200: returns new water date', ()=> {

    const Users = mongoose.model("users", usersSchema);
    return Users.findOne({username: "jane_smith"})
    .then((user) =>{
  
      const userPlants = user.plants[0]

        return request(app)
        .patch(`/api/users/${user._id}/tasks/${userPlants}`)
        .send({})
        .expect(200)
        .then(({body: {nextWaterDate}}) => {
  
          expect(nextWaterDate.tasks).toHaveProperty("toBeWateredAgain", expect.any(String))
          expect(nextWaterDate).toHaveProperty("_id", expect.any(String))
          expect(nextWaterDate).toHaveProperty("plantType", expect.any(Number))
        })
      })
    })
    test("Status 400: invalid plant_id", ()=>{
    const Users = mongoose.model("users", usersSchema);
    return Users.findOne({username: "jane_smith"})
    .then((user)=>{
      return request(app)
        .patch(`/api/users/${user._id}/tasks/WRONGPLANTID`)
        .send({})
        .expect(400)
        .then(({body})=>{
          expect(body.msg).toBe("Bad Request")
          expect(body.detail).toBe("Invalid Plant ID")
        })

    })
    })
  })

