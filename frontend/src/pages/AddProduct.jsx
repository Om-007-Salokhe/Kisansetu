import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload } from 'lucide-react';
import api from '../api/axios';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Grains', price: '', quantity: '', unit: 'kg', location: '', image: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        images: formData.image ? [formData.image] : []
      };
      await api.post('/products', payload);
      alert('Product created successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-100 text-brand-600 rounded-xl"><PlusCircle size={28} /></div>
        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required>
              <option value="Grains">Grains</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"></textarea>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required>
              <option value="kg">kg</option>
              <option value="ton">ton</option>
              <option value="quintal">quintal</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Farm Location / City</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Nashik, Maharashtra" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Optional)</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all hover-lift disabled:opacity-50">
          {loading ? 'Publishing...' : 'List Product For Sale'}
        </button>
      </form>
    </div>
  );
}
