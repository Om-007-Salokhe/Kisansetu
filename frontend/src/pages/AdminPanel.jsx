import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Users, ShoppingBag, TrendingUp, UserCheck, ShieldAlert, CheckCircle, Package, IndianRupee } from 'lucide-react';
import api from '../api/axios';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, productsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/products')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Loading Management Console...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Console</h1>
          <p className="text-gray-500 mt-1">Full platform overview and user management.</p>
        </div>
        <div className="px-4 py-2 bg-brand-50 rounded-2xl border border-brand-100">
          <span className="text-brand-700 font-bold text-sm flex items-center gap-2">
            <UserCheck size={16} /> Verified Admin Session
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard icon={<Users className="text-blue-600" />} label="Farmers" count={stats?.stats?.totalFarmers} color="bg-blue-50" />
        <StatCard icon={<ShoppingBag className="text-brand-600" />} label="Buyers" count={stats?.stats?.totalBuyers} color="bg-brand-50" />
        <StatCard icon={<Package className="text-amber-600" />} label="Products" count={stats?.stats?.totalProducts} color="bg-amber-50" />
        <StatCard icon={<TrendingUp className="text-purple-600" />} label="Orders" count={stats?.stats?.totalOrders} color="bg-purple-50" />
        <StatCard icon={<IndianRupee className="text-green-600" />} label="Platform Revenue" count={`₹${stats?.stats?.totalRevenue || 0}`} color="bg-green-50" />
      </div>

      {/* Main Content Areas */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Recently Processed</TabButton>
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>User Database</TabButton>
          <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')}>Market Audit</TabButton>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-sm font-medium border-b border-gray-50 uppercase tracking-widest">
                      <th className="pb-4">Order ID</th>
                      <th className="pb-4">Buyer</th>
                      <th className="pb-4">Product</th>
                      <th className="pb-4">Amount</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats?.recentOrders?.map(order => (
                      <tr key={order._id} className="text-gray-700">
                        <td className="py-4 font-mono text-xs">{order._id}</td>
                        <td className="py-4 font-medium">{order.buyer_id?.name || 'Walk-in'}</td>
                        <td className="py-4 text-gray-500">{order.product_id?.title}</td>
                        <td className="py-4 font-bold text-brand-600">₹{order.total_amount}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">Success</span>
                        </td>
                      </tr>
                    ))}
                    {!stats?.recentOrders?.length && <tr><td colSpan="5" className="py-8 text-center text-gray-400 italic">No recent orders found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Platform User Directory</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-sm font-medium border-b border-gray-50 uppercase tracking-widest">
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Role</th>
                      <th className="pb-4">Phone</th>
                      <th className="pb-4">Location</th>
                      <th className="pb-4">Aadhar No.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <tr key={u._id} className="text-gray-700 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${u.role === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {u.name.charAt(0)}
                            </div>
                            <span className="font-bold">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 text-sm font-medium">{u.phone || 'N/A'}</td>
                        <td className="py-4 text-sm">{u.city || 'Not Set'}</td>
                        <td className="py-4 font-mono text-xs">{u.aadhar_card || 'XXXXXXXXXXXX'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Current Market Listings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-sm font-medium border-b border-gray-50 uppercase tracking-widest">
                      <th className="pb-4">Listing</th>
                      <th className="pb-4">Farmer</th>
                      <th className="pb-4">Category</th>
                      <th className="pb-4">Price</th>
                      <th className="pb-4">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map(p => (
                      <tr key={p._id} className="text-gray-700">
                        <td className="py-4 font-bold">{p.title}</td>
                        <td className="py-4 text-gray-500">{p.farmer_id?.name}</td>
                        <td className="py-4 text-xs font-medium text-gray-400 uppercase">{p.category}</td>
                        <td className="py-4 font-bold">₹{p.price}/{p.unit}</td>
                        <td className="py-4">
                           {p.quantity > 10 ? <span className="text-green-600 font-bold">In Stock</span> : <span className="text-amber-500 font-bold">Low Stock</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, count, color }) => (
  <div className={`p-6 rounded-3xl border border-gray-100 shadow-sm ${color} transition-transform hover:-translate-y-1`}>
    <div className="flex flex-col gap-4">
       <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
         {icon}
       </div>
       <div>
         <p className="text-sm font-medium text-gray-500">{label}</p>
         <p className="text-3xl font-black text-gray-900">{count || 0}</p>
       </div>
    </div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button 
    onClick={onClick}
    className={`px-8 py-4 font-bold text-sm transition-all border-b-2 ${active ? 'border-brand-600 text-brand-700 bg-brand-50/10' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
  >
    {children}
  </button>
);

export default AdminPanel;
