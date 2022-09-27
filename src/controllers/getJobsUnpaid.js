const { Op } = require("sequelize");

module.exports = async (req, res) => {
  const { Job, Contract } = req.app.get("models");
  const { id: profileId } = req.profile;
  const jobs = await Job.findAll({
    include: [
      {
        model: Contract,
        where: {
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
          status: "in_progress",
        },
      },
    ],
    where: {
      paid: { [Op.not]: true },
    },
  });

  res.json(jobs);
};
