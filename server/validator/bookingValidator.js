const { body, param } = require("express-validator");

const bookingValidator = [
  body("eventId")
    .trim()
    .notEmpty()
    .withMessage("Event id is required.")
    .bail()
    .isMongoId()
    .withMessage("Event id must be a valid MongoDB id."),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("Booking OTP is required.")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("Booking OTP must contain exactly 6 digits.")
    .bail()
    .isNumeric()
    .withMessage("Booking OTP must contain only digits."),
];

const bookingConfirmationValidator = [
  param("id")
    .isMongoId()
    .withMessage("Booking id must be a valid MongoDB id."),
  body("paymentStatus")
    .notEmpty()
    .withMessage("Payment status is required.")
    .bail()
    .isIn(["paid", "not_paid"])
    .withMessage("Payment status must be either paid or not_paid."),
];

const bookingIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Booking id must be a valid MongoDB id."),
];

module.exports = {
  bookingValidator,
  bookingConfirmationValidator,
  bookingIdValidator,
};
