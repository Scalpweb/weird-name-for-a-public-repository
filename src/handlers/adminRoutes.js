const moment = require("moment");
const { sequelize } = require("../model");
const router = require("express").Router();

/**
 * @returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range
 */
router.get("/best-profession", async (req, res) => {
  if (!req.query.startDate || !req.query.endDate) {
    return res
      .status(401)
      .json({ error: "You must specify a timeframe" })
      .end();
  }

  const startDate = moment(req.query.startDate, "YYYY/MM/DD", true);
  const endDate = moment(req.query.endDate, "YYYY/MM/DD", true);

  if (!startDate.isValid() || !endDate.isValid()) {
    return res
      .status(401)
      .json({ error: "Start and end date must be formatted as YYYY/MM/DD" })
      .end();
  }

  const results = await sequelize.query(
    `SELECT SUM(Jobs.price) as TotalEarned, Contractor.profession
      FROM Jobs
      LEFT JOIN Contracts ON Contracts.id = Jobs.ContractId
      LEFT JOIN Profiles AS Contractor ON Contractor.id = Contracts.ContractorId
      WHERE Jobs.createdAt >= :startDate AND Jobs.createdAt <= :endDate
      GROUP BY Contractor.id
      ORDER BY SUM(Jobs.price) DESC
      LIMIT 1`,
    {
      replacements: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  res.json(results);
});

/**
 * @returns the clients the paid the most for jobs in the query time perio
 */
router.get("/best-clients", async (req, res) => {
  if (!req.query.startDate || !req.query.endDate) {
    return res
      .status(401)
      .json({ error: "You must specify a timeframe" })
      .end();
  }

  if (req.query.limit && isNaN(req.query.limit)) {
    return res
      .status(401)
      .json({ error: "Limit parameter must be an integer" })
      .end();
  }

  const startDate = moment(req.query.startDate, "YYYY/MM/DD", true);
  const endDate = moment(req.query.endDate, "YYYY/MM/DD", true);
  const limit = parseInt(req.query.limit) || 2;

  if (!startDate.isValid() || !endDate.isValid()) {
    return res
      .status(401)
      .json({ error: "Start and end date must be formatted as YYYY/MM/DD" })
      .end();
  }

  const results = await sequelize.query(
    `SELECT SUM(Jobs.price) as TotalPayed, Client.firstname, Client.lastname
      FROM Jobs
      LEFT JOIN Contracts ON Contracts.id = Jobs.ContractId
      LEFT JOIN Profiles AS Client ON Client.id = Contracts.ClientId
      WHERE Jobs.createdAt >= :startDate AND Jobs.createdAt <= :endDate
      GROUP BY Client.id
      ORDER BY SUM(Jobs.price) DESC
      LIMIT :limit`,
    {
      replacements: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit,
      },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  res.json(results);
});

module.exports = router;
