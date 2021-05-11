const supertest = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("../model");
const { getProfile } = require("../middleware/getProfile");
const contractHandlers = require("./contractRoutes");

sequelize.options.logging = false;

const app = express();

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(getProfile);

app.use("/contracts", contractHandlers);

describe("/contracts", () => {
  it("should get the list of non-terminated contracts associated to the user", async () => {
    const result = await supertest(app).get("/contracts").set("profile_id", 1);

    expect(result.statusCode).toEqual(200);
    expect(result.body.length).toEqual(1);
    expect(result.body[0].id).toEqual(2);
  });
});

describe("/contracts/:id", () => {
  it("should returns the specified contract", async () => {
    const result = await supertest(app)
      .get("/contracts/1")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(200);
    expect(result.body.id).toEqual(1);
  });

  it("should returns a 404 error if contract does not belong to user", async () => {
    const result = await supertest(app)
      .get("/contracts/3")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(404);
  });

  it("should returns a 404 error if contract does not exist", async () => {
    const result = await supertest(app)
      .get("/contracts/3000")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(404);
  });
});
