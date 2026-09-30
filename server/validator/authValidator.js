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

const passwordResetRequestValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
];

const passwordResetValidator = [
  ...passwordResetRequestValidator,
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
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .bail()
    .isLength({ min: 6, max: 128 })
    .withMessage("New password must be between 6 and 128 characters."),
];

const profileUpdateValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters."),
  body("currentPassword")
    .optional()
    .isLength({ min: 6, max: 128 })
    .withMessage("Current password must be between 6 and 128 characters."),
  body("newPassword")
    .optional()
    .isLength({ min: 6, max: 128 })
    .withMessage("New password must be between 6 and 128 characters."),
  body().custom((value) => {
    const hasName = typeof value.name === "string" && value.name.trim();
    const hasNewPassword = Boolean(value.newPassword);

    if (!hasName && !hasNewPassword) {
      throw new Error("Provide a name or a new password to update.");
    }

    if (hasNewPassword && !value.currentPassword) {
      throw new Error("Current password is required to set a new password.");
    }

    return true;
  }),
];

module.exports = {
  registerValidator,
  loginValidator,
  verifyOtpValidator,
  passwordResetRequestValidator,
  passwordResetValidator,
  profileUpdateValidator,
};
