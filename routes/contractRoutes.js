const express = require("express");
const contractController = require("../controllers/contractController");
const auth = require("../middleware/auth");

const contractRouter = express.Router();

contractRouter.post(
  "/create",
  auth.checkAuth,
  auth.allowRoles(["client"]),
  contractController.createContract
);

contractRouter.get(
  "/for-freelancer",
  auth.checkAuth,
  auth.allowRoles(["freelancer"]),
  contractController.getContractsForFreelancer
);

contractRouter.get(
  "/:contractId",
  auth.checkAuth,
  contractController.getContractByContractId
);

module.exports = contractRouter;
