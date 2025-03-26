const express = require("express");
const auth = require("../middleware/auth");
const serviceController = require("../controllers/serviceController");
const serviceRouter = express.Router();

serviceRouter.post(
  "/create",
  auth.checkAuth,
  auth.allowRoles(["freelancer"]),
  serviceController.createService
);

serviceRouter.get(
  "/",
  auth.checkAuth,
  auth.allowRoles(["freelancer"]),
  serviceController.getServices
);

serviceRouter.get(
  "/:serviceID",
  auth.checkAuth,
  auth.allowRoles(["freelancer"]),
  serviceController.getServiceById
);

serviceRouter.put(
  "/update/:serviceID",
  auth.checkAuth,
  auth.allowRoles(["freelancer"]),
  serviceController.updateService
);

serviceRouter.delete(
  "/:serviceID",
  auth.checkAuth,
  auth.allowRoles(["freelancer"]),
  serviceController.deleteService
);

serviceRouter.get(
  "/search/job",
  auth.checkAuth,
  auth.allowRoles(["freelancer"]),
  serviceController.searchJobs
);

module.exports = serviceRouter;
