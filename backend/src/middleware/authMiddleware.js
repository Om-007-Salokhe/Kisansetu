const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_super_secret_key';

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const splitToken = token.split(' ')[1];
    const decoded = jwt.verify(splitToken || token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
