import { Op } from "sequelize";

const dateIsValid = (date) => date instanceof Date && !isNaN(date);

const DEFAULT_LIMIT = 2;

export default async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { Job, Contract, Profile } = req.app.get("models");
  const { start, end, limit } = req.query;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (!dateIsValid(startDate)) {
    return res.status(401).send("Start date is invalid").end();
  }

  if (!dateIsValid(endDate)) {
    return res.status(401).send("End date is invalid").end();
  }

  const aggregation = await Job.findAll({
    attributes: [
      [sequelize.fn("sum", sequelize.col("price")), "sumPrice"],
      "contractId",
    ],
    include: [
      {
        attributes: ["ClientId"],
        model: Contract,
        include: {
          attributes: ["id", "firstName", "lastName"],
          model: Profile,
          as: "Client",
        },
      },
    ],
    where: {
      paymentDate: {
        [Op.between]: [startDate.toISOString(), endDate.toISOString()],
      },
    },
    group: ["Contract->Client.id"],
    order: [["sumPrice", "DESC"]],
    limit: limit ?? DEFAULT_LIMIT,
  });

  const response = aggregation.map(
    ({
      dataValues: { sumPrice },
      Contract: {
        Client: { firstName, lastName, id },
      },
    }) => ({
      id,
      fullName: `${firstName} ${lastName}`,
      paid: sumPrice,
    })
  );

  res.json(response);
};
