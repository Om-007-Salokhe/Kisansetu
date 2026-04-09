const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  images: [{ type: String }],
  location: { type: String }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('Product', productSchema);
