const router = require("express").Router();

router.post("/deposit/:userId", async (req, res) => {
  const { Profile, Job, Contract } = req.app.get("models");
  const { userId } = req.params;

  if (!req.body.amount) {
    return res
      .status(401)
      .json({ error: "You must specify an amount to transfer" })
      .end();
  }

  if (req.profile.id === parseInt(userId)) {
    return res
      .status(401)
      .json({ error: "You cannot deposit money to the same account" })
      .end();
  }

  const targetProfile = await Profile.findOne({
    where: {
      id: userId,
      type: "client",
    },
  });

  if (!targetProfile) {
    return res.status(404).end();
  }

  const totalJobToPay = await Job.sum("price", {
    where: { paid: null },
    include: {
      model: Contract,
      where: {
        ClientId: req.profile.id,
      },
    },
  });

  if (totalJobToPay * 0.25 < req.body.amount) {
    return res
      .status(401)
      .json({
        error: `You cannot deposit more than ${totalJobToPay} at the moment`,
      })
      .end();
  }

  try {
    targetProfile.balance += req.body.amount;
    targetProfile.save();
  } catch (e) {
    console.error(e);
    res.status(500);
  }

  res.status(200).end();
});

module.exports = router;
