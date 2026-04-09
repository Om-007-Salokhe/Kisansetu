const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/chat', aiController.getChatResponse);
router.get('/weather', aiController.getWeather);
router.get('/market-prices', aiController.getMarketPrices);
router.get('/schemes', aiController.getSchemes);
router.post('/detect-disease', upload.single('image'), aiController.detectDisease);

module.exports = router;
