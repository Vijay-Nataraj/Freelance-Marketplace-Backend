const express = require("express");
const { checkAuth } = require("../middleware/auth");
const paymentController = require("../controllers/paymentController");

const paymentRouter = express.Router();

paymentRouter.post("/create-order", checkAuth, paymentController.createOrder);
paymentRouter.post(
  "/verify-payment",
  checkAuth,
  paymentController.verifyPayment
);

module.exports = paymentRouter;
