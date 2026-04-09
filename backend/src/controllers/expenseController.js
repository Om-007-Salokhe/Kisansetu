const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.addExpense = async (req, res) => {
  const { category, amount, description, date } = req.body;
  try {
    const expense = await Expense.create({
      farmer_id: req.user.id,
      category,
      amount,
      description,
      date: date || new Date()
    });
    res.status(201).json(expense);
  } catch (err) {
    console.error('Add expense error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getFarmerStats = async (req, res) => {
  try {
    const farmerId = req.user.id;

    // 1. Get total active listings
    const activeListings = await Product.countDocuments({ farmer_id: farmerId });

    // 2. Get total revenue (sum of all orders for this farmer's products)
    const myProducts = await Product.find({ farmer_id: farmerId }).select('_id');
    const myProductIds = myProducts.map(p => p._id);
    
    const myOrders = await Order.find({ product_id: { $in: myProductIds } });
    const totalRevenue = myOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

    // 3. Get total expenses
    const myExpenses = await Expense.find({ farmer_id: farmerId });
    const totalExpenses = myExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    // 4. Calculate monthly graph data for the last 6 months
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const graphData = [];
    
    // Build array of last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      graphData.push({
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        name: monthNames[d.getMonth()],
        revenue: 0,
        expenses: 0
      });
    }

    // Populate revenue into graph
    myOrders.forEach(order => {
      const d = new Date(order.created_at);
      const m = d.getMonth();
      const y = d.getFullYear();
      const pt = graphData.find(g => g.monthIndex === m && g.year === y);
      if (pt) pt.revenue += (order.total_amount || 0);
    });

    // Populate expenses into graph
    myExpenses.forEach(exp => {
      const d = new Date(exp.date || exp.created_at);
      const m = d.getMonth();
      const y = d.getFullYear();
      const pt = graphData.find(g => g.monthIndex === m && g.year === y);
      if (pt) pt.expenses += (exp.amount || 0);
    });

    res.json({
      summary: {
        totalRevenue,
        totalExpenses,
        activeListings
      },
      graphData
    });
  } catch (err) {
    console.error('Get stats error:', err.message);
    res.status(500).send('Server Error');
  }
};
