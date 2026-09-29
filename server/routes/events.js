const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');
const validateRequest = require('../validator/validateRequest');
const { createEventValidator, updateEventValidator, eventIdValidator, eventQueryValidator } = require('../validator/eventValidator');

// GET /api/events - Get all events
router.get('/', eventQueryValidator, validateRequest, getEvents);

// GET /api/events/:id - Get event by ID
router.get('/:id', eventIdValidator, validateRequest, getEventById);

// POST /api/events - Create a new event (Admin only)
router.post('/', protect, admin, createEventValidator, validateRequest, createEvent);

// PUT /api/events/:id - Update an event (Admin only)
router.put('/:id', protect, admin, eventIdValidator, updateEventValidator, validateRequest, updateEvent);

// DELETE /api/events/:id - Delete an event (Admin only)
router.delete('/:id', protect, admin, eventIdValidator, validateRequest, deleteEvent);

module.exports = router;
