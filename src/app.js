const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const adminHandlers = require("./handlers/adminRoutes");
const balanceHandlers = require("./handlers/balanceRoutes");
const contractHandlers = require("./handlers/contractRoutes");
const jobHandlers = require("./handlers/jobRoutes");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(getProfile);

app.use("/admin", adminHandlers);
app.use("/balances", balanceHandlers);
app.use("/contracts", contractHandlers);
app.use("/jobs", jobHandlers);

module.exports = app;
