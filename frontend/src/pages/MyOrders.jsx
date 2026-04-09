import { useState, useEffect } from 'react';
import { ShoppingCart, IndianRupee, CheckCircle } from 'lucide-react';
import api from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/buyer');
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to fetch buyer orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-100 text-brand-600 rounded-xl"><ShoppingCart size={28} /></div>
        <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
      </div>

      {loading ? (
        <p className="text-gray-500 font-medium">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 bg-white p-8 rounded-2xl border border-gray-100 text-center font-medium">You haven't purchased anything yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover-lift relative overflow-hidden">
              
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={order.images && order.images.length > 0 ? order.images[0] : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=60'} 
                  alt={order.product_title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{order.product_title}</h3>
                  <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 uppercase tracking-wide flex items-center gap-1 shadow-sm">
                    <CheckCircle size={12}/> Confirmed
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-3 font-medium">Ordered on: {new Date(order.created_at).toLocaleDateString()}</p>
                
                <div className="flex items-center gap-4 text-sm font-medium">
                   <p className="bg-gray-50 px-3 py-1.5 rounded-xl text-gray-700 border border-gray-100 shadow-sm">Payment: {order.payment_method}</p>
                   <p className="bg-gray-50 px-3 py-1.5 rounded-xl text-gray-700 border border-gray-100 shadow-sm">Qty: {order.quantity}</p>
                </div>
              </div>

              <div className="text-right border-l border-gray-100 pl-6 my-2">
                <p className="text-sm text-gray-500 mb-1 font-medium">Total Paid</p>
                <div className="text-2xl font-bold text-brand-600 flex items-center justify-end tracking-tight"><IndianRupee size={22} strokeWidth={2.5}/>{order.total_amount}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
