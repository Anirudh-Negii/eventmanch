const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: [10, "Total seats must be at least 10"],
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    ticketPrice: {
      type: Number,
      required: true,
      min: [0, "Ticket price must be a positive number"],
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
