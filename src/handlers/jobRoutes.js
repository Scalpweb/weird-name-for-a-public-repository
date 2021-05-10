const router = require("express").Router();
const { Op } = require("sequelize");
const { sequelize } = require("../model");

/**
 * @returns unpaid active jobs
 */
router.get("/unpaid", async (req, res) => {
  const { Contract, Job } = req.app.get("models");
  const contracts = await Contract.findAll({
    where: { ...req.filter, status: "in_progress" },
    include: Job,
  });

  res.json(
    contracts
      .map((c) => c.Jobs)
      .flat()
      .filter((j) => j.paid === null)
  );
});

/**
 * @returns pay for a job
 */
router.post("/:job_id/pay", async (req, res) => {
  const { Contract, Job, Profile } = req.app.get("models");
  const { job_id } = req.params;
  const job = await Job.findOne({
    where: { id: job_id },
    include: {
      model: Contract,
      include: {
        model: Profile,
        as: "Contractor",
      },
    },
  });

  if (!job) {
    return res.status(404).end();
  }

  if (job.Contract.ClientId !== req.profile.id) {
    return res.status(401).end();
  }

  if (job.paid) {
    return res.status(401).json({ error: "Job has already been paid" }).end();
  }

  if (job.price > req.profile.balance) {
    return res.status(401).json({ error: "Balance is too low" }).end();
  }

  try {
    const transaction = await sequelize.transaction();
    const client = await Profile.findOne({
      where: {
        id: req.profile.id,
        balance: {
          [Op.gte]: job.price,
        },
      },
      lock: transaction.LOCK.UPDATE,
      transaction: transaction,
    });
    await client.decrement(
      { balance: job.price },
      { transaction: transaction }
    );
    await job.Contract.Contractor.increment(
      { balance: job.price },
      { transaction: transaction }
    );
    await job.update({ paid: true }, { transaction: transaction });
    await transaction.commit();
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }

  res.status(200).end();
});

module.exports = router;
