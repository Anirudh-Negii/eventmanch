const express = require('express');
const router = express.Router();
const { register, login, verifyOTP, updateProfile } = require('../controllers/authController');
const validateRequest = require('../validator/validateRequest');
const { registerValidator, loginValidator, verifyOtpValidator, profileUpdateValidator } = require('../validator/authValidator');
const { loginLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginLimiter, loginValidator, validateRequest, login);
router.post('/verify-otp', verifyOtpValidator, validateRequest, verifyOTP);
router.put('/profile', protect, profileUpdateValidator, validateRequest, updateProfile);

module.exports = router;
