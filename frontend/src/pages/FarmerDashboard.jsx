import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, IndianRupee, Sprout, PlusCircle, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

export default function FarmerDashboard() {
  const [stats, setStats] = useState({
    summary: { totalRevenue: 0, totalExpenses: 0, activeListings: 0 },
    graphData: []
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({ category: 'Seeds', amount: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStats = async () => {
    try {
      const [statsRes, prodRes] = await Promise.all([
        api.get('/expenses/stats'),
        api.get('/products')
      ]);
      setStats(statsRes.data);
      setRecentProducts(prodRes.data.slice(0, 4)); // Show only top 4
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/expenses', {
        category: expenseForm.category,
        amount: parseFloat(expenseForm.amount),
        description: expenseForm.description
      });
      setExpenseForm({ category: 'Seeds', amount: '', description: '' });
      await fetchStats(); // Refresh the graph and cards
    } catch (err) {
      alert('Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading Dashboard...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard/listings" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition-transform"><IndianRupee size={24} /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <h4 className="text-2xl font-bold text-gray-900">₹{stats.summary.totalRevenue}</h4>
              </div>
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
          </div>
          <p className="text-sm text-gray-500 font-medium whitespace-nowrap">View sales performance</p>
        </Link>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-default">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl"><IndianRupee size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
              <h4 className="text-2xl font-bold text-gray-900">₹{stats.summary.totalExpenses}</h4>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium whitespace-nowrap">Tracked farming costs</p>
        </div>

        <Link to="/dashboard/listings" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-100 text-brand-600 rounded-xl group-hover:scale-110 transition-transform"><Sprout size={24} /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Listings</p>
                <h4 className="text-2xl font-bold text-gray-900">{stats.summary.activeListings} Products</h4>
              </div>
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
          </div>
          <p className="text-sm text-gray-500 font-medium whitespace-nowrap">Manage your marketplace ads</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue vs Expenses (6 Months)</h3>
          <div className="h-80 w-full" style={{ minHeight: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value}`]}
                />
                <Line name="Revenue" type="monotone" dataKey="revenue" stroke="#1ab069" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 8}} />
                <Line name="Expenses" type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add Expense Form */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><PlusCircle size={20} /></div>
             <h3 className="text-xl font-bold text-gray-900">Add Expense</h3>
          </div>

          <form onSubmit={handleExpenseSubmit} className="flex-1 flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={expenseForm.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none">
                <option value="Seeds">Seeds</option>
                <option value="Fertilizers">Fertilizers</option>
                <option value="Labor">Labor</option>
                <option value="Equipment">Equipment</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input type="number" name="amount" value={expenseForm.amount} onChange={handleChange} min="1" placeholder="e.g. 5000" required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea name="description" value={expenseForm.description} onChange={handleChange} rows="3" placeholder="e.g. Bought tomato seeds" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"></textarea>
            </div>

            <div className="mt-auto pt-4">
              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-md transition-all disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Log Expense'}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Recent Marketplace Activity */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
           <h3 className="text-xl font-bold text-gray-900">Recent Marketplace Overview</h3>
           <Link to="/dashboard/marketplace" className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:underline">
             See All Products <ArrowRight size={14} />
           </Link>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {recentProducts.map(product => (
            <div key={product.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
              <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=60'} alt="" className="w-12 h-12 object-cover rounded-xl" />
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{product.title}</p>
                <p className="text-xs text-brand-600 font-bold">₹{product.price}/{product.unit}</p>
              </div>
            </div>
          ))}
          {recentProducts.length === 0 && <p className="text-gray-400 text-sm italic col-span-4 text-center py-4">No marketplace activity yet.</p>}
        </div>
      </div>
    </div>
  );
}
