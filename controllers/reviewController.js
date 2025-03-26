const Review = require("../models/Review");

const reviewController = {
  addReview: async (req, res) => {
    try {
      const { reviewedFor, contractId, rating, feedback } = req.body;

      if (!reviewedFor || !contractId || !rating || !feedback) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newReview = new Review({
        reviewedBy: req.user.id,
        reviewedFor,
        contractId,
        rating,
        feedback,
      });

      await newReview.save();
      res.status(201).json({ message: "Review added successfully", newReview });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getReviewsForUser: async (req, res) => {
    try {
      const reviews = await Review.find({ reviewedFor: req.params.userId })
        .populate("reviewedBy", "name email")
        .populate("contractId", "jobId");
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getReviewsByUser: async (req, res) => {
    try {
      const reviews = await Review.find({ reviewedBy: req.user.id })
        .populate("reviewedFor", "name email")
        .populate("contractId", "jobId");
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = reviewController;
