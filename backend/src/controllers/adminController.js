const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getStats = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate Total Platform Revenue
    const allOrders = await Order.find().select('total_amount');
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    
    // Recent activity
    const recentOrders = await Order.find()
      .populate('buyer_id', 'name')
      .populate('product_id', 'title')
      .sort({ created_at: -1 })
      .limit(5);

    res.json({
      stats: {
        totalFarmers,
        totalBuyers,
        totalProducts,
        totalOrders,
        totalRevenue
      },
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error fetching stats' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-firebase_uid');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error fetching users' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('farmer_id', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server Error fetching products' });
  }
};
