const OTP = require('../models/OTP');
const axios = require('axios');
// const twilio = require('twilio');
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    // 1. Generate a random 4-digit OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Delete any existing OTPs for this number to prevent spam/conflicts
    await OTP.deleteMany({ phoneNumber });

    // 3. Save the new OTP to the database (it will auto-expire in 5 mins due to TTL)
    await OTP.create({
      phoneNumber,
      otp: generatedOtp
    });

    // 4. Send SMS via Providers (Twilio, Authkey, or Fast2SMS)
    const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    const SMS_API_KEY = process.env.SMS_API_KEY;

    if (TWILIO_SID && TWILIO_TOKEN && TWILIO_TOKEN !== 'YOUR_TWILIO_AUTH_TOKEN') {
      try {
        const twilio = require('twilio');
        const client = twilio(TWILIO_SID, TWILIO_TOKEN);
        await client.messages.create({
          body: `Your KisanSetu Secure Order Verification OTP is: ${generatedOtp}. Do not share this with anyone.`,
          from: TWILIO_NUMBER,
          to: phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`
        });
        console.log(`✅ Twilio OTP dispatched to ${phoneNumber}`);
      } catch (twilioErr) {
        console.error('Twilio Error:', twilioErr.message);
      }
    } else if (SMS_API_KEY && SMS_API_KEY !== 'YOUR_FAST2SMS_KEY') {
      try {
        // Fast2SMS Fallback
        await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${SMS_API_KEY}&route=otp&variables_values=${generatedOtp}&numbers=${phoneNumber}`);
        console.log(`✅ Fast2SMS dispatched to ${phoneNumber}`);
      } catch (smsErr) {
        console.error('Fast2SMS Error:', smsErr.response?.data || smsErr.message);
      }
    } else {
      console.log(`\n⚠️  [NO SMS KEY] OTP for ${phoneNumber}: ${generatedOtp}`);
      console.log(`👉 Add TWILIO credentials to your .env for real SMS.\n`);
    }

    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  try {
    // 1. Find the OTP record in the database
    const otpRecord = await OTP.findOne({ phoneNumber, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
    }

    // 2. If valid, delete it so it can't be reused
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};
