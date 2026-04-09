import { useState, useEffect } from 'react';
import { Package, IndianRupee, MapPin } from 'lucide-react';
import api from '../api/axios';

export default function MyListings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/farmer');
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch farmer products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-100 text-brand-600 rounded-xl"><Package size={28} /></div>
        <h2 className="text-2xl font-bold text-gray-900">My Product Listings</h2>
      </div>

      {loading ? (
        <p className="text-gray-500 font-medium">Loading your listings...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 bg-white p-8 rounded-2xl border border-gray-100 text-center font-medium">You haven't listed any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover-lift group flex flex-col">
              <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=60'} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-700">
                  {product.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{product.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-4"><MapPin size={14} /> {product.location || 'Local Farm'}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xl font-bold text-brand-600 flex items-center"><IndianRupee size={20} />{product.price}<span className="text-sm text-gray-500 font-normal">/{product.unit}</span></div>
                  <div className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-bold shadow-inner">Qty: {product.quantity}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
