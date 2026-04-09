const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getDB } = require('./src/config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/product'));
app.use('/api/orders', require('./src/routes/order'));
app.use('/api/expenses', require('./src/routes/expense'));
app.use('/api/otp', require('./src/routes/otp'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/ai', require('./src/routes/ai'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'KisanSetu Backend is running!' });
});

// Start Server
getDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize database", err)
});
