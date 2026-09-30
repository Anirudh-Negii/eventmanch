const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  otp: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6,
  },
  action: {
    type: String,
    enum: ["account_verification", "event_booking", "password_reset"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  }, // OTP expires in 5 minutes
});

module.exports = mongoose.model("OTP", otpSchema);
