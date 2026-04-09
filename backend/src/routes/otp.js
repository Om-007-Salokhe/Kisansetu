const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const auth = require('../middleware/authMiddleware');

router.post('/send', auth, otpController.sendOtp);
router.post('/verify', auth, otpController.verifyOtp);

module.exports = router;
