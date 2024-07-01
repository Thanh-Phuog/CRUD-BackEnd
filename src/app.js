const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const swagger = require("../swagger");

app.use(bodyParser.json());
swagger(app);

require("dotenv").config();

require("./dbs/mongo");
app.use(require("./routers"));
module.exports = app;
