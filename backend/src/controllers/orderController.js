const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const OTP = require('../models/OTP');

exports.createOrder = async (req, res) => {
  const { productId, quantity, totalAmount, paymentMethod, transactionId, otp } = req.body;
  
  try {
    // 1. Mandatory OTP Verification for online payments (UPI/CARD)
    if (paymentMethod !== 'COD') {
      if (!otp) {
        return res.status(400).json({ message: 'Security OTP is required to process this order.' });
      }

      // Fetch the registered phone number of the authenticated user
      const user = await User.findById(req.user.id);
      if (!user || !user.phone) {
        return res.status(400).json({ message: 'No registered phone number found. Please update your profile.' });
      }

      // Verify the OTP against the database
      const otpRecord = await OTP.findOne({ phoneNumber: user.phone, otp: otp });
      if (!otpRecord) {
        return res.status(401).json({ message: 'Invalid or expired OTP. Order rejected.' });
      }

      // If valid, delete the OTP so it can't be reused for another transaction
      await OTP.deleteOne({ _id: otpRecord._id });
    }

    // 2. Create the order
    const order = await Order.create({
      buyer_id: req.user.id,
      product_id: productId,
      quantity,
      total_amount: totalAmount,
      payment_method: paymentMethod
    });

    // 3. Create the transaction record
    await Transaction.create({
      order_id: order._id,
      amount: totalAmount,
      gateway_transaction_id: transactionId
    });

    // 4. Send Confirmation SMS via Twilio
    const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER;

    if (TWILIO_SID && TWILIO_TOKEN && TWILIO_TOKEN !== 'YOUR_TWILIO_AUTH_TOKEN') {
      try {
        const twilio = require('twilio');
        const client = twilio(TWILIO_SID, TWILIO_TOKEN);
        const buyer = await User.findById(req.user.id);
        
        const messageBody = `KisanSetu: Success! Your order (#${order._id.toString().slice(-6)}) for ₹${totalAmount} has been confirmed. Thank you for using our platform!`;
        
        // Send to Buyer
        if (buyer?.phone) {
          await client.messages.create({
            body: messageBody,
            from: TWILIO_NUMBER,
            to: buyer.phone.startsWith('+') ? buyer.phone : `+91${buyer.phone}`
          });
        }
        
        // Send to Monitor Number (8600660792)
        await client.messages.create({
          body: `Admin Alert: New Order #${order._id.toString().slice(-6)} received from ${buyer?.name} for ₹${totalAmount}.`,
          from: TWILIO_NUMBER,
            to: '+918600660792'
        });

        console.log(`✅ Order confirmations sent via Twilio`);
      } catch (twilioErr) {
        console.error('Twilio Order Msg Error:', twilioErr.message);
      }
    }

    res.json({ message: 'Order created successfully!', orderId: order._id });
  } catch (err) {
    console.error('Order creation error:', err.message);
    res.status(500).json({ message: 'Server Error during secure order processing.' });
  }
};

exports.getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer_id: req.user.id })
      .populate('product_id', 'title images')
      .sort({ created_at: -1 })
      .lean();
      
    const mapped = orders.map(o => ({
      ...o,
      id: o._id,
      product_title: o.product_id ? o.product_id.title : 'Unknown Product',
      images: o.product_id ? o.product_id.images : []
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
