import { Op } from "sequelize";

export default async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id: profileId } = req.profile;
  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      status: { [Op.not]: "terminated" },
    },
  });

  res.json(contracts);
};
