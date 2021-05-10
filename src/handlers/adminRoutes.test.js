const supertest = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("../model");
const { getProfile } = require("../middleware/getProfile");
const adminHandlers = require("./adminRoutes");

const app = express();

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(getProfile);

app.use("/admin", adminHandlers);

describe("/admin/best-profession", () => {
  it("should return the best profession", async () => {
    const result = await supertest(app)
      .get("/admin/best-profession?startDate=2000/01/01&endDate=2100/01/01")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toMatchObject([
      { TotalEarned: 4840, profession: "Programmer" },
    ]);
  });

  it("should requires startDate", async () => {
    const result = await supertest(app)
      .get("/admin/best-profession?endDate=2100/01/01")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(401);
  });

  it("should requires endDate", async () => {
    const result = await supertest(app)
      .get("/admin/best-profession?startDate=2100/01/01")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(401);
  });

  it("should requires properly formatted date", async () => {
    const result = await supertest(app)
      .get("/admin/best-profession?startDate=1&&endDate=2")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(401);
  });

  it("should return empty result for empty timeframe", async () => {
    const result = await supertest(app)
      .get("/admin/best-profession?startDate=2000/01/01&endDate=2000/01/01")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toMatchObject([]);
  });
});

describe("/admin/best-clients", () => {
  it("should return the best 2 clients", async () => {
    const result = await supertest(app)
      .get("/admin/best-clients?startDate=2000/01/01&endDate=2100/01/01")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toMatchObject([
      { TotalPayed: 4440, firstName: "Ash", lastName: "Kethcum" },
      { TotalPayed: 1688, firstName: "Mr", lastName: "Robot" },
    ]);
  });

  it("should return the best 3 clients if limit param is set to 3", async () => {
    const result = await supertest(app)
      .get(
        "/admin/best-clients?startDate=2000/01/01&endDate=2100/01/01&limit=3"
      )
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toMatchObject([
      { TotalPayed: 4440, firstName: "Ash", lastName: "Kethcum" },
      { TotalPayed: 1688, firstName: "Mr", lastName: "Robot" },
      { TotalPayed: 1686, firstName: "Harry", lastName: "Potter" },
    ]);
  });

  it("should requires startDate", async () => {
    const result = await supertest(app)
      .get("/admin/best-clients?endDate=2100/01/01")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(401);
  });

  it("should requires endDate", async () => {
    const result = await supertest(app)
      .get("/admin/best-clients?startDate=2100/01/01")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(401);
  });

  it("should requires properly formatted date", async () => {
    const result = await supertest(app)
      .get("/admin/best-clients?startDate=1&&endDate=2")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(401);
  });

  it("should return empty result for empty timeframe", async () => {
    const result = await supertest(app)
      .get("/admin/best-clients?startDate=2000/01/01&endDate=2000/01/01")
      .set("profile_id", 1);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toMatchObject([]);
  });
});
