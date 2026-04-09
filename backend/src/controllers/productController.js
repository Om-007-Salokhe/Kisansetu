const Product = require('../models/Product');
const User = require('../models/User');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('farmer_id', 'name city').lean();
    
    // Parse images json string to array
    const mapped = products.map(p => ({
      ...p,
      id: p._id,
      farmer_name: p.farmer_id ? p.farmer_id.name : 'Unknown',
      location: p.farmer_id ? p.farmer_id.city : p.location
    }));
    
    res.json(mapped);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createProduct = async (req, res) => {
  const { title, description, category, price, quantity, unit, images, location } = req.body;
  try {
    const product = await Product.create({
      farmer_id: req.user.id,
      title,
      description,
      category,
      price,
      quantity,
      unit,
      images: images || [],
      location
    });
    
    const pObj = product.toObject();
    pObj.id = pObj._id;
    res.json(pObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer_id: req.user.id }).lean();
    const mapped = products.map(p => ({
      ...p,
      id: p._id
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
