const express = require('express');
const router = express.Router();
const { register, login, verifyOTP } = require('../controllers/authController');
const validateRequest = require('../validator/validateRequest');
const { registerValidator, loginValidator, verifyOtpValidator } = require('../validator/authValidator');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginLimiter, loginValidator, validateRequest, login);
router.post('/verify-otp', verifyOtpValidator, validateRequest, verifyOTP);

module.exports = router;
