import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../features/authSlice';
import { Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center">
            <Leaf className="w-8 h-8 text-brand-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">{t('common.welcome')}</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.email')}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder={t('common.placeholderEmail')}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.password')}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder={t('common.placeholderPassword')}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all hover-lift"
          >
            {t('common.signIn')}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          {t('common.noAccount')} <Link to="/register" className="text-brand-600 font-semibold hover:underline">{t('common.registerHere')}</Link>
        </p>
      </div>
    </div>
  );
}
