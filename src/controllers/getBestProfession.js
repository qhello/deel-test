import { Op } from "sequelize";

const dateIsValid = (date) => date instanceof Date && !isNaN(date);

export default async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { Job, Contract, Profile } = req.app.get("models");
  const { start, end } = req.query;

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
        attributes: ["ContractorId"],
        model: Contract,
        include: {
          attributes: ["profession"],
          model: Profile,
          as: "Contractor",
        },
      },
    ],
    where: {
      paymentDate: {
        [Op.between]: [startDate.toISOString(), endDate.toISOString()],
      },
    },
    group: ["Contract->Contractor.profession"],
    order: [["sumPrice", "DESC"]],
  });

  const response = {
    profession: aggregation[0]?.Contract.Contractor.profession,
    totalPaid: aggregation[0]?.dataValues.sumPrice,
  };

  res.json(response);
};
