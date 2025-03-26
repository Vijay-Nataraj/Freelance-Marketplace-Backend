const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    milestones: [
      {
        description: { type: String, required: true },
        dueDate: { type: Date, required: true },
        payment: { type: Number, required: true },
        status: {
          type: String,
          enum: ["Pending", "Completed"],
          default: "Pending",
        },
      },
    ],
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Terminated"],
      default: "Ongoing",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Contract", contractSchema);
