const Proposal = require("../models/Proposal");
const Contract = require("../models/Contract");

const proposalController = {
  sendProposal: async (req, res) => {
    try {
      const { jobId, description, proposedBudget, clientId } = req.body;

      const newProposal = new Proposal({
        jobId,
        freelancerId: req.user.id,
        clientId,
        description,
        proposedBudget,
      });

      await newProposal.save();
      res
        .status(201)
        .json({ message: "Proposal sent successfully", newProposal });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProposalsForClient: async (req, res) => {
    try {
      const proposals = await Proposal.find({ clientId: req.user.id })
        .populate("freelancerId", "name email")
        .populate("jobId", "title");

      res.status(200).json(proposals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProposalStatus: async (req, res) => {
    try {
      const { status } = req.body;

      if (!["Pending", "Accepted", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const proposal = await Proposal.findById(req.params.id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      // If rejected, delete the proposal from the database
      if (status === "Rejected") {
        await Proposal.findByIdAndDelete(req.params.id);
        return res
          .status(200)
          .json({ message: "Proposal rejected and deleted" });
      }

      proposal.status = status;

      if (status === "Accepted") {
        const contract = new Contract({
          jobId: proposal.jobId,
          clientId: proposal.clientId,
          freelancerId: proposal.freelancerId,
          milestones: [],
        });

        await contract.save();
      }

      await proposal.save();

      res.status(200).json({ message: "Proposal status updated", proposal });
    } catch (error) {
      console.error("Error updating proposal status:", error);
      res.status(500).json({ message: error.message });
    }
  },

  getProposalsForJob: async (req, res) => {
    const { jobId } = req.params;

    console.log("Received jobId:", jobId);

    try {
      const proposals = await Proposal.find({ jobId });
      if (!proposals) {
        return res
          .status(404)
          .json({ message: "No proposals found for this job." });
      }

      res.status(200).json(proposals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = proposalController;
