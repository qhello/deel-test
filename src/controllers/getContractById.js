import { Op } from "sequelize";

export default async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  const { id: profileId } = req.profile;

  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });
  if (!contract) return res.status(404).end();

  res.json(contract);
};
