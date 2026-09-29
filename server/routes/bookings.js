const express = require('express');
const router = express.Router();
const { bookEvent, confirmBooking, getMyBookings, cancelBooking, sendBookingOTP } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');
const validateRequest = require('../validator/validateRequest');
const { bookingValidator, bookingConfirmationValidator, bookingIdValidator } = require('../validator/bookingValidator');

router.post('/send-otp', protect, sendBookingOTP);
router.post('/', protect, bookingValidator, validateRequest, bookEvent);
router.put('/:id/confirm', protect, admin, bookingConfirmationValidator, validateRequest, confirmBooking);
router.get('/my', protect, getMyBookings);
router.delete('/:id', protect, bookingIdValidator, validateRequest, cancelBooking);

module.exports = router;
