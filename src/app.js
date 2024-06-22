const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

require("dotenv").config();

require("./dbs/mongo");
app.use(require("./routers"));
module.exports = app;
