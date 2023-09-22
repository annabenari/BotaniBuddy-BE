const app = require("./app");
const { PORT = 3000 } = process.env;
const connection = require("./db/connection");

connection();
app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
