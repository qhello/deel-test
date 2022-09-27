const { Transaction } = require("sequelize");

module.exports = async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { Job, Contract, Profile } = req.app.get("models");
  const { job_id } = req.params;
  const {
    id: profileId,
    type: profileType,
    balance: profileBalance,
  } = req.profile;

  if (profileType !== "client") {
    return res.status(401).send("You arent a client").end();
  }

  try {
    await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      },
      async () => {
        const job = await Job.findOne({
          include: [
            {
              model: Contract,
              where: {
                ClientId: profileId,
                status: "in_progress",
              },
            },
          ],
          where: {
            id: job_id,
          },
        });

        if (!job) {
          throw new Error("Couldn't find associated unpaid job");
        }

        if (job.price > profileBalance) {
          throw new Error("Can't pay - your balance is too low");
        }

        await Profile.decrement("balance", {
          by: job.price,
          where: { id: profileId },
        });

        await Profile.increment("balance", {
          by: job.price,
          where: { id: job.Contract.ContractorId },
        });

        await Job.update(
          {
            paid: true,
          },
          {
            where: {
              id: job_id,
            },
          }
        );
      }
    );

    res.json("OK");
  } catch (e) {
    console.error(e);
    return res.status(401).send(e.message).end();
  }
};
