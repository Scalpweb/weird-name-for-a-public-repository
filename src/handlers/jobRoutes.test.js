const supertest = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("../model");
const { getProfile } = require("../middleware/getProfile");
const jobHandlers = require("./jobRoutes");

sequelize.options.logging = false;

const app = express();

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(getProfile);

app.use("/jobs", jobHandlers);

describe("/jobs/unpaid", () => {
  it("should get the list of unpaid jobs", async () => {
    const result = await supertest(app)
      .get("/jobs/unpaid")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(200);
    expect(result.body.length).toEqual(2);
  });
});

describe("/jobs/:job_id/pay", () => {
  it("should require the job to exist", async () => {
    const result = await supertest(app)
      .post("/jobs/0/pay")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(404);
  });

  it("should require the job to belong to the client", async () => {
    const result = await supertest(app)
      .post("/jobs/6/pay")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(401);
  });

  it("should require the job to not have been paid", async () => {
    const result = await supertest(app)
      .post("/jobs/11/pay")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(401);
  });

  it("should pay for a job", async () => {
    const result = await supertest(app)
      .post("/jobs/1/pay")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(200);
  });
});
