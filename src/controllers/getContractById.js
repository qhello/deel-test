module.exports = async (req, res) => {
    const { Contract } = req.app.get("models");
    const { id } = req.params;
    const { id: ContractorId } = req.profile;
    const contract = await Contract.findOne({ where: { id, ContractorId } });
    if (!contract) return res.status(404).end();
    res.json(contract);
  }