const express = require("express");
const { checkAuth, allowRoles } = require("../middleware/auth.js");
const roleRouter = express.Router();

roleRouter.get("/guest-area", checkAuth, allowRoles(["guest"]), (req, res) => {
  res.status(200).send("Welcome, Guest!");
});

roleRouter.get(
  "/freelancer-dashboard",
  checkAuth,
  allowRoles(["freelancer"]),
  (req, res) => {
    res.status(200).send("Welcome, Freelancer!");
  }
);

roleRouter.get(
  "/client-dashboard",
  checkAuth,
  allowRoles(["client"]),
  (req, res) => {
    res.status(200).send("Welcome, Client!");
  }
);

module.exports = roleRouter;
