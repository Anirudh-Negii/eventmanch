const { body, param, query } = require("express-validator");

const eventFields = [
  "title",
  "description",
  "date",
  "location",
  "category",
  "totalSeats",
  "ticketPrice",
  "image",
];

const rejectUnknownEventFields = body().custom((value) => {
  const unknownFields = Object.keys(value || {}).filter(
    (field) => !eventFields.includes(field),
  );

  if (unknownFields.length) {
    throw new Error(`Unknown event field(s): ${unknownFields.join(", ")}.`);
  }

  return true;
});

const eventFieldValidators = (required) => [
  body("title")
    .if((_, { req }) => required || req.body.title !== undefined)
    .trim()
    .notEmpty()
    .withMessage("Event title is required.")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("Event title must be between 3 and 150 characters."),
  body("description")
    .if((_, { req }) => required || req.body.description !== undefined)
    .trim()
    .notEmpty()
    .withMessage("Event description is required.")
    .bail()
    .isLength({ min: 20, max: 3000 })
    .withMessage("Event description must be between 20 and 3000 characters."),
  body("date")
    .if((_, { req }) => required || req.body.date !== undefined)
    .notEmpty()
    .withMessage("Event date is required.")
    .bail()
    .isISO8601()
    .withMessage("Event date must be a valid date.")
    .bail()
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        throw new Error("Event date cannot be earlier than today.");
      }
      return true;
    })
    .toDate(),
  body("location")
    .if((_, { req }) => required || req.body.location !== undefined)
    .trim()
    .notEmpty()
    .withMessage("Event location is required.")
    .bail()
    .isLength({ min: 2, max: 150 })
    .withMessage("Event location must be between 2 and 150 characters."),
  body("category")
    .if((_, { req }) => required || req.body.category !== undefined)
    .trim()
    .notEmpty()
    .withMessage("Event category is required.")
    .bail()
    .isLength({ min: 2, max: 80 })
    .withMessage("Event category must be between 2 and 80 characters."),
  body("totalSeats")
    .if((_, { req }) => required || req.body.totalSeats !== undefined)
    .notEmpty()
    .withMessage("Total seats are required.")
    .bail()
    .isInt({ min: 1, max: 100000 })
    .withMessage("Total seats must be an integer between 1 and 100000.")
    .toInt(),
  body("ticketPrice")
    .optional({ values: "falsy" })
    .isFloat({ min: 0, max: 10000000 })
    .withMessage("Ticket price must be between 0 and 10000000.")
    .toFloat(),
  body("image")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Image must be a valid URL.")
    .isLength({ max: 1000 })
    .withMessage("Image URL must be under 1000 characters."),
];

const createEventValidator = [rejectUnknownEventFields, ...eventFieldValidators(true)];

const updateEventValidator = [
  rejectUnknownEventFields,
  body().custom((value) => {
    if (!value || Object.keys(value).length === 0) {
      throw new Error("At least one event field is required for an update.");
    }
    return true;
  }),
  ...eventFieldValidators(false),
];

const eventIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Event id must be a valid MongoDB id."),
];

const eventQueryValidator = [
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search text must be 100 characters or fewer."),
  query("category")
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage("Category must be 80 characters or fewer."),
];

module.exports = {
  createEventValidator,
  updateEventValidator,
  eventIdValidator,
  eventQueryValidator,
};
