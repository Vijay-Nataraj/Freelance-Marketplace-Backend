const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    freelancerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    workSamples: [{ type: String }],
    availability: {
      type: String,
      enum: ["Available", "Not Available"],
      default: "Available",
    },
    skills: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
