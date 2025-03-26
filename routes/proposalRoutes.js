const express = require("express");
const auth = require("../middleware/auth");
const proposalController = require("../controllers/proposalController");

const proposalRouter = express.Router();

proposalRouter.post(
  "/send",
  auth.checkAuth,
  auth.allowRoles(["freelancer"]),
  proposalController.sendProposal
);
proposalRouter.get(
  "/for-client",
  auth.checkAuth,
  auth.allowRoles(["client"]),
  proposalController.getProposalsForClient
);
proposalRouter.put(
  "/update/:id",
  auth.checkAuth,
  auth.allowRoles(["client"]),
  proposalController.updateProposalStatus
);

proposalRouter.get("/job/:jobId", proposalController.getProposalsForJob);

module.exports = proposalRouter;
