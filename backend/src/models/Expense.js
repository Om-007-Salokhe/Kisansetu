const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('Expense', expenseSchema);
