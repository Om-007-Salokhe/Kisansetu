const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_super_secret_key';

exports.register = async (req, res) => {
  const { name, email, password, phone, aadhar_card, city, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, firebase_uid: hashedPassword, phone, aadhar_card, city, role
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key errors (code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} already exists.`;
      return res.status(400).json({ message });
    }

    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.firebase_uid);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      user: { id: user._id, name: user.name, role: user.role, email: user.email },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-firebase_uid');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userObj = user.toObject();
    userObj.id = userObj._id;
    delete userObj._id;
    res.json(userObj);
  } catch (error) {
    console.error('getMe Error:', error);
    res.status(500).json({ message: 'Server error retrieving user data' });
  }
};

exports.updateMe = async (req, res) => {
  const { name, email, phone, city, aadhar_card } = req.body;
  try {
    console.log('Updating profile for user:', req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (city) user.city = city;
    if (aadhar_card) user.aadhar_card = aadhar_card;

    await user.save();
    console.log('Profile updated successfully');

    const userObj = user.toObject();
    userObj.id = userObj._id;
    delete userObj._id;
    delete userObj.firebase_uid;

    res.json(userObj);
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is already in use by another account.`;
      return res.status(400).json({ message });
    }

    res.status(500).json({ message: 'Server error during profile update' });
  }
};
