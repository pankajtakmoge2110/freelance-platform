const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: [true, "Bid amount is required"],
      min: [1, "Bid amount must be at least 1"],
    },

    deliveryDays: {
      type: Number,
      required: [true, "Delivery days is required"],
      min: [1, "Delivery days must be at least 1"],
    },

    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
      maxlength: [1000, "Cover letter cannot exceed 1000 characters"],
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// One freelancer can only bid once per project
BidSchema.index({ project: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model("Bid", BidSchema);