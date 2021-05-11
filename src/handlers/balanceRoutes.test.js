const supertest = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("../model");
const { getProfile } = require("../middleware/getProfile");
const balanceHandlers = require("./balanceRoutes");

sequelize.options.logging = false;

const app = express();

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(getProfile);

app.use("/balances", balanceHandlers);

describe("/deposit/:userId", () => {
  it("should require an amount", async () => {
    const result = await supertest(app)
      .post("/balances/deposit/2", {})
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(401);
  });

  it("should require both account to be different", async () => {
    const result = await supertest(app)
      .post("/balances/deposit/1")
      .send({ amount: 10 })
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(401);
  });

  it("should require target user to exist", async () => {
    const result = await supertest(app)
      .post("/balances/deposit/2000")
      .send({ amount: 10 })
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(404);
  });

  it("should require amount to not be too high", async () => {
    const result = await supertest(app)
      .post("/balances/deposit/2")
      .send({ amount: 10000000 })
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(401);
  });

  it("should deposit balance to target user balance", async () => {
    const result = await supertest(app)
      .post("/balances/deposit/2")
      .send({ amount: 10 })
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(200);
  });
});
