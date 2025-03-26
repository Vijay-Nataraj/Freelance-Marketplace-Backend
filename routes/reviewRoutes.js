const express = require("express");
const { checkAuth } = require("../middleware/auth");
const reviewController = require("../controllers/reviewController");

const reviewRouter = express.Router();

reviewRouter.post("/add-review", checkAuth, reviewController.addReview);
reviewRouter.get(
  "/for-user/:userId",
  checkAuth,
  reviewController.getReviewsForUser
);
reviewRouter.get("/by-user", checkAuth, reviewController.getReviewsByUser);

module.exports = reviewRouter;
