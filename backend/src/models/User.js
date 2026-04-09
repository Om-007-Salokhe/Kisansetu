const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true },
  aadhar_card: { type: String, unique: true },
  city: { type: String },
  role: { type: String, default: 'buyer' },
  firebase_uid: { type: String, unique: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('User', userSchema);
