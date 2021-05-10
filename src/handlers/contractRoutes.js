const { Op } = require("sequelize");
const router = require("express").Router();

/**
 * @returns contract by id
 */
router.get("/:id", async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  const contract = await Contract.findOne({ where: { id, ...req.filter } });

  if (!contract) {
    return res.status(404).end();
  }

  res.json(contract);
});

/**
 * @returns contract for profile
 */
router.get("/", async (req, res) => {
  const { Contract } = req.app.get("models");
  const contracts = await Contract.findAll({
    where: { ...req.filter, status: { [Op.ne]: "terminated" } },
  });

  res.json(contracts);
});

module.exports = router;
