require("dotenv").config();
require("./database/index");
const routes = require("../src/routes");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Server is on in port ${PORT}`);
});
