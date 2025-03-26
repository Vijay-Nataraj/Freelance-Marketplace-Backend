const Contract = require("../models/Contract");

const contractController = {
  createContract: async (req, res) => {
    try {
      const { jobId, freelancerId, milestones } = req.body;

      const newContract = new Contract({
        jobId,
        clientId: req.user.id,
        freelancerId,
        milestones,
      });

      await newContract.save();
      res
        .status(201)
        .json({ message: "Contract created successfully", newContract });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getContractsForFreelancer: async (req, res) => {
    try {
      const contracts = await Contract.find({ freelancerId: req.user.id })
        .populate("jobId", "title")
        .populate("clientId", "name email");

      res.status(200).json(contracts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = contractController;
