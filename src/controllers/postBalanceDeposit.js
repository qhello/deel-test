const { Transaction, Op } = require("sequelize");

module.exports = async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { Job, Contract, Profile } = req.app.get("models");
  const { userId } = req.params;
  const {
    id: profileId,
    type: profileType,
    balance: profileBalance,
  } = req.profile;

  const amountToDeposit = parseInt(req.body.amount, 10);

  if (isNaN(amountToDeposit)) {
    return res
      .status(401)
      .send("You need to specify a correct amount to deposit")
      .end();
  }

  if (profileType !== "client") {
    return res.status(401).send("You arent a client").end();
  }

  if (profileId !== parseFloat(userId)) {
    return res
      .status(401)
      .send("You can't deposit into someone else's balance")
      .end();
  }

  try {
    await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      },
      async () => {
        const [
          {
            dataValues: { sumPrice },
          },
        ] = await Job.findAll({
          attributes: [
            [sequelize.fn("sum", sequelize.col("price")), "sumPrice"],
          ],
          include: [
            {
              attributes: [],
              model: Contract,
              where: {
                ClientId: userId,
                status: "in_progress",
              },
            },
          ],
          where: {
            paid: { [Op.not]: true },
          },
        });

        const maxAmountToBeDeposited = sumPrice * 0.25;

        console.log({
          amountToDeposit,
          maxAmountToBeDeposited,
        });

        if (amountToDeposit > maxAmountToBeDeposited) {
          throw new Error(
            `Amount to deposit (${amountToDeposit}), is too high (needs to be lower than ${maxAmountToBeDeposited}, total unpaid jobs: ${sumPrice})`
          );
        }

        await Profile.increment("balance", {
          by: amountToDeposit,
          where: { id: userId },
        });
      }
    );

    res.json("OK");
  } catch (e) {
    console.error(e);
    return res.status(401).send(e.message).end();
  }
};
