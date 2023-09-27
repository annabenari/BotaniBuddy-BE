const database = require("./db/connection");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { postUser, postLogin } = require("./controllers/login.controller");
const { mongoErrors, customErrors, axiosErrors } = require("./errors/errors");
const mongoSanitize = require("express-mongo-sanitize");
const {
  getPlants,
  getSpecificPlant,
} = require("./controllers/plants.controller");
const {
  postPlantBySearch,
  postIdentificationRequest,
} = require("./controllers/search.controller");
const { updateTasks } = require("./controllers/updateTasks.controller");

const { getTasks } = require("./controllers/tasks.controller");

const app = express();
database();

app.use(cors());
app.use(express.json());

app.use(mongoSanitize());

app.post("/api/register", postUser);
app.post("/api/login", postLogin);
app.get("/api/users/:user_id/plants", getPlants);
app.get("/api/users/:user_id/plants/:plant_id", getSpecificPlant);
app.post("/api/users/:user_id/add_by_search", postPlantBySearch);
app.post(
  "/api/users/:user_id/identify_plants_image",
  upload.single("image"),
  postIdentificationRequest
);
app.get(`/api/users/:user_id/tasks`, getTasks);

app.patch("/api/users/:user_id/tasks/:plant_id", updateTasks)

app.use((request, response) => {
  response.status(404).send({ msg: "Not found" });
});

app.use(mongoErrors);
app.use(axiosErrors);
app.use(customErrors);

module.exports = app;
