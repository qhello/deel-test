const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const controllers = require("./controllers");
const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

/**
 * @returns contract by id, only if it belongs to the profile calling
 */
app.get("/contracts/:id", getProfile, controllers.getContractById);

/**
 * @returns contracts that belongs to the profile calling
 */
app.get("/contracts", getProfile, controllers.getContracts);

/**
 * @returns jobs, that are unpaid & belongs to contracts that belongs to the profile calling
 */
app.get("/jobs/unpaid", getProfile, controllers.getJobsUnpaid);

/**
 * @returns 200 OK, or error. Will attempt to pay an unpaid job
 */
app.post("/jobs/:job_id/pay", getProfile, controllers.postJobsPay);

/**
 * @returns 200 OK, or error. Will attempt to deposit specified money into client's balance
 */
app.post(
  "/balances/deposit/:userId",
  getProfile,
  controllers.postBalanceDeposit
);

module.exports = app;
