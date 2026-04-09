const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  status: { type: String, default: 'confirmed' },
  payment_method: { type: String }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('Order', orderSchema);
