const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const controllers = require("./controllers")
const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

/**
 * @returns contract by id, only if it belongs to the profile calling 
 */
app.get("/contracts/:id", getProfile, controllers.getContractById);
module.exports = app;
