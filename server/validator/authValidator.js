const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .bail()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isLength({ min: 6, max: 128 })
    .withMessage("Password must be between 6 and 128 characters."),
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

const verifyOtpValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required.")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must contain exactly 6 digits.")
    .bail()
    .isNumeric()
    .withMessage("OTP must contain only digits."),
];

module.exports = { registerValidator, loginValidator, verifyOtpValidator };
