const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

let isConnected = false;

async function initDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kisansetu';
  
  await mongoose.connect(uri);
  isConnected = true;
  console.log('Connected to MongoDB!');
  
  // Optional: Seed data if empty
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const u1 = await User.create({
        name: 'Rajesh Kumar',
        email: 'farmer@test.com',
        phone: '9876543210',
        aadhar_card: '123412341234',
        city: 'Pune',
        role: 'farmer',
        firebase_uid: '$2b$10$X8aR8Hj8s.v2vMwW8yN4l.pW2Svwc8lW2W2W2W2W2W2W2W2W2W2W2'
      });
      const u2 = await User.create({
        name: 'Amit Singh',
        email: 'buyer@test.com',
        phone: '9876543211',
        aadhar_card: '123412341235',
        city: 'Mumbai',
        role: 'buyer',
        firebase_uid: '$2b$10$X8aR8Hj8s.v2vMwW8yN4l.pW2Svwc8lW2W2W2W2W2W2W2W2W2W2W2'
      });
      
      await Product.create({
        farmer_id: u1._id,
        title: 'Organic Wheat',
        description: 'Fresh organic wheat.',
        category: 'Grains',
        price: 30.50,
        quantity: 1000,
        unit: 'kg',
        location: 'Pune',
        images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=60"]
      });
      
      await Product.create({
        farmer_id: u1._id,
        title: 'Fresh Tomatoes',
        description: 'Red juicy tomatoes.',
        category: 'Vegetables',
        price: 40.00,
        quantity: 500,
        unit: 'kg',
        location: 'Pune',
        images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=60"]
      });
      console.log('MongoDB Seeded!');
    }
  } catch(e) {
    console.log('Seed check skipped', e.message);
  }
}

module.exports = {
  getDB: async () => {
    if (!isConnected) {
        await initDB();
    }
  }
};
