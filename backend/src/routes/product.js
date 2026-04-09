const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.post('/', auth, productController.createProduct);
router.get('/farmer', auth, productController.getFarmerProducts);

module.exports = router;
