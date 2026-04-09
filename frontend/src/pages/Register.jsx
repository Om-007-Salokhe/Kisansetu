import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../features/authSlice';
import { Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', aadhar_card: '', city: '', role: 'farmer'
  });
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await dispatch(registerUser(formData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center">
            <Leaf className="w-8 h-8 text-brand-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">{t('common.createAccount')}</h2>
        <p className="text-center text-gray-500 mb-8">{t('common.joinSubtitle')}</p>
        
        <form className="space-y-5" onSubmit={handleRegister}>
          {localError && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{localError}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.fullName')}</label>
              <input type="text" name="name" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.email')}</label>
              <input type="email" name="email" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.phone')}</label>
              <input type="tel" name="phone" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.password')}</label>
              <input type="password" name="password" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.aadhar')}</label>
            <input type="text" name="aadhar_card" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.city')}</label>
              <input type="text" name="city" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.role')}</label>
              <select name="role" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none">
                <option value="farmer">{t('common.farmer')}</option>
                <option value="buyer">{t('common.buyer')}</option>
                <option value="admin">{t('common.admin')} (Demo)</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 mt-4 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all hover-lift disabled:opacity-50">
            {loading ? t('common.creatingAccount') : t('common.register')}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          {t('common.alreadyAccount')} <Link to="/login" className="text-brand-600 font-semibold hover:underline">{t('common.loginHere')}</Link>
        </p>
      </div>
    </div>
  );
}
