const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'success' },
  gateway_transaction_id: { type: String }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('Transaction', transactionSchema);
