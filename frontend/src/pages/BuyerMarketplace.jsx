import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Search, Filter, MapPin, IndianRupee, X, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';
import api from '../api/axios';
import CommissionQR from '../assets/commission-qr.png';

export default function BuyerMarketplace() {
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Checkout Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [paymentStep, setPaymentStep] = useState(1); // 1 = Details, 2 = OTP, 3 = Success
  const [otp, setOtp] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [contactNumber, setContactNumber] = useState('');
  const [cartError, setCartError] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setPaymentStep(1);
    setPaymentMethod('UPI');
    // Pre-fill with user's registered phone number if available
    setContactNumber(user?.phone || '');
    setOtp('');
    setCartError('');
    setOrderQuantity(1);
  };

  const handleProcessStep1 = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setCartError('');

    if (paymentMethod === 'COD') {
      // Skip OTP for Local COD implementation
      await handlePlaceOrder(true);
      return;
    }

    if (!contactNumber) {
      setCartError('Please provide a valid contact number for payment verification.');
      setProcessing(false);
      return;
    }

    try {
      // Trigger the real-time OTP generation and SMS Dispatch logic
      await api.post('/otp/send', { phoneNumber: contactNumber });
      setProcessing(false);
      setPaymentStep(2);
    } catch (err) {
      console.error(err);
      setCartError(err.response?.data?.message || 'Failed to send OTP server request.');
      setProcessing(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setCartError('');
    
    // Instead of verifying separately, we send the OTP to handlePlaceOrder
    // Backend now validates OTP during the order creation request
    await handlePlaceOrder(false, otp);
  };

  const quantityToBuy = parseInt(orderQuantity) || 1;
  const basePrice = selectedProduct ? parseFloat(selectedProduct.price) * quantityToBuy : 0;
  const commissionPrice = selectedProduct ? (basePrice * 0.01).toFixed(2) : 0;
  const finalPrice = selectedProduct ? (basePrice + parseFloat(commissionPrice)).toFixed(2) : 0;

  const handlePlaceOrder = async (isCod, verificationOtp) => {
    setProcessing(true);
    setCartError('');
    try {
      await api.post('/orders', {
        productId: selectedProduct.id,
        quantity: quantityToBuy, 
        totalAmount: parseFloat(finalPrice),
        paymentMethod: paymentMethod,
        transactionId: isCod ? 'COD_' + Math.random().toString(36).substr(2, 9) : 'TXN_' + Math.random().toString(36).substr(2, 9),
        otp: verificationOtp // Send the OTP here
      });
      setProcessing(false);
      setPaymentStep(3); // Success
    } catch (err) {
      console.error(err);
      setCartError(err.response?.data?.message || 'Payment failed to process on server.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-full shadow-sm border border-gray-100">
        <div className="flex items-center flex-1 w-full px-4 border-r border-gray-100">
          <Search className="text-gray-400 w-5 h-5 mr-3" />
          <input type="text" placeholder="Search crops, vegetables..." className="w-full py-2 outline-none text-gray-700 bg-transparent" />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading Marketplace...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover-lift group flex flex-col">
              <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=60'} 
                  alt={product.title || product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-700">
                  {product.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{product.title || product.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-4"><MapPin size={14} /> {product.location}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xl font-bold text-brand-600 flex items-center"><IndianRupee size={20} />{product.price}<span className="text-sm text-gray-500 font-normal">/{product.unit}</span></div>
                  <button onClick={() => handleBuyClick(product)} className="px-5 py-2 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20">Buy</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-brand-600 px-6 py-4 flex items-center justify-between text-white">
              <h3 className="font-bold flex items-center gap-2"><ShieldCheck size={20} /> Secure Checkout</h3>
              <button onClick={() => setSelectedProduct(null)} className="hover:bg-brand-700 p-1 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="p-6">
              {cartError && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg text-center font-medium">{cartError}</div>}
              
              {paymentStep === 1 && (
                <form onSubmit={handleProcessStep1} className="space-y-4">
                  <div className="bg-brand-50 p-4 rounded-xl mb-6">
                    <p className="text-sm text-gray-600">Order Summary</p>
                    <p className="font-bold text-gray-900 text-lg">{selectedProduct.title}</p>
                    
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between items-center">
                        <span>Quantity ({selectedProduct.unit}):</span> 
                        <input 
                          type="number" 
                          min="1" 
                          max={selectedProduct.quantity}
                          value={orderQuantity} 
                          onChange={(e) => setOrderQuantity(e.target.value)} 
                          className="w-20 px-2 py-1 text-right border border-gray-300 rounded outline-none focus:border-brand-500 bg-white"
                        />
                      </div>
                      <div className="flex justify-between"><span>Base Price:</span> <span>₹{basePrice}</span></div>
                      <div className="flex justify-between text-brand-700"><span>Admin Commission (1%):</span> <span>₹{commissionPrice}</span></div>
                      <div className="text-xs text-brand-700 text-right font-bold mt-1">UPI: 9322339866@ybl</div>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-brand-200">
                      <span className="text-gray-900 font-medium">Total Payable</span>
                      <span className="font-bold text-brand-700 text-xl flex items-center"><IndianRupee size={18}/>{finalPrice}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select 
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                      <option value="UPI">UPI (GPay, PhonePe, Paytm)</option>
                      <option value="COD">Cash on Delivery (COD)</option>
                      <option value="CARD">Credit / Debit Card</option>
                    </select>
                  </div>

                  {paymentMethod !== 'COD' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                      <p className="text-xs text-gray-500 mb-2">Secure OTP will be sent to your registered number:</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-700 tracking-wider">
                          {user?.phone ? `+91 ******${user.phone.slice(-4)}` : (
                            <input 
                              type="tel" 
                              maxLength="10" 
                              placeholder="Enter Phone Number" 
                              value={contactNumber} 
                              onChange={(e) => setContactNumber(e.target.value)} 
                              required 
                              className="w-full outline-none bg-transparent" 
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={processing} className="w-full py-3.5 mt-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-black shadow-lg transition-all disabled:opacity-50">
                    {processing ? 'Processing...' : paymentMethod === 'COD' ? 'Confirm Order' : 'Send Banking OTP'}
                  </button>
                </form>
              )}

              {paymentStep === 2 && (
                <form onSubmit={handleVerifyOTP} className="space-y-4 text-center py-4 max-h-[70vh] overflow-y-auto pr-2">
                  <h4 className="text-lg font-bold text-gray-900 leading-tight">Step 2: Pay Commission & Verify</h4>
                  
                  <div className="bg-brand-50 p-4 rounded-3xl border border-brand-100 mb-4">
                    <p className="text-xs text-brand-700 font-bold uppercase tracking-wider mb-2">Total Secure Payment</p>
                    <div className="flex justify-center mb-3">
                      <div className="bg-white p-2 rounded-2xl shadow-sm border border-brand-200 overflow-hidden">
                        <img 
                          src={CommissionQR} 
                          alt="Payment QR" 
                          className="w-40 h-40 object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900 leading-none">₹{finalPrice}</p>
                    <p className="text-[11px] font-bold text-brand-700 mt-2">UPI ID: 9322339866@ybl</p>
                    <p className="text-[10px] text-gray-500 mt-1">Scan for direct payment of product + platform fee</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Verify Real-Time SMS OTP</p>
                    <p className="text-[11px] text-gray-400">Sent directly to +91 {contactNumber ? contactNumber.slice(-10) : 'XXXXXXXXXX'}.</p>
                    <input 
                      type="text" 
                      maxLength="4" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      className="w-full text-center tracking-[0.8em] text-2xl font-black px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-brand-500 outline-none transition-all" 
                      placeholder="••••" 
                      required 
                    />
                  </div>
                  
                  <button type="submit" disabled={processing} className="w-full py-4 mt-2 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] disabled:opacity-50">
                    {processing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : `Confirm & Pay ₹${finalPrice}`}
                  </button>
                  <p className="text-[10px] text-gray-400 mt-2">By clicking confirm, you Agree to the direct P2P transaction protocols.</p>
                </form>
              )}

              {paymentStep === 3 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">Order Successful!</h4>
                  <p className="text-gray-500 mt-2 mb-6">
                    {paymentMethod === 'COD' ? 'Your order is confirmed and will be paid on delivery.' : 'Payment has been processed! Commission routed to Admin UPI: 9322339866@ybl'}
                  </p>
                  <button onClick={() => { setSelectedProduct(null); fetchProducts(); }} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all">
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
