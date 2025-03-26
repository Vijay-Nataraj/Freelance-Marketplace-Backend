const express = require("express");
const auth = require("../middleware/auth");
const jobController = require("../controllers/jobController");

const jobRouter = express.Router();

jobRouter.get("/all", jobController.getAllJobs);

jobRouter.post(
  "/create",
  auth.checkAuth,
  auth.allowRoles(["client"]),
  jobController.createJob
);

jobRouter.get(
  "/",
  auth.checkAuth,
  auth.allowRoles(["client"]),
  jobController.getJobs
);

jobRouter.get(
  "/:jobId",
  auth.checkAuth,
  auth.allowRoles(["client"]),
  jobController.getJobById
);

jobRouter.put(
  "/update/:jobId",
  auth.checkAuth,
  auth.allowRoles(["client"]),
  jobController.updateJob
);

jobRouter.delete(
  "/:jobId",
  auth.checkAuth,
  auth.allowRoles(["client"]),
  jobController.deleteJob
);

jobRouter.get(
  "/search/freelancers",
  auth.checkAuth,
  auth.allowRoles(["client"]),
  jobController.searchFreelancers
);

module.exports = jobRouter;
