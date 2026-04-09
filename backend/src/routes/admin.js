const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');

// Middleware to check for Admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

router.get('/stats', auth, isAdmin, adminController.getStats);
router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.get('/products', auth, isAdmin, adminController.getAllProducts);

module.exports = router;
