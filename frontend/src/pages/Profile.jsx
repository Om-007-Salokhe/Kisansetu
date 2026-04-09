import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/authSlice';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, CreditCard, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    aadhar_card: ''
  });
  
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        aadhar_card: user.aadhar_card || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('Profile Settings')}</h1>
        <p className="text-gray-500 mt-2">Update your personal information and contact details.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
                <AlertCircle size={20} />
                <p className="font-medium">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700">
                <CheckCircle2 size={20} />
                <p className="font-medium">Profile updated successfully!</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <User size={16} className="text-brand-500" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all bg-gray-50/50"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <Mail size={16} className="text-brand-500" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all bg-gray-50/50"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-brand-500" /> Phone Number
                  </div>
                  <button 
                    type="button"
                    onClick={async () => {
                      try {
                        await api.post('/otp/send', { phoneNumber: formData.phone });
                        alert('Test OTP Sent to your mobile!');
                      } catch (err) {
                        alert('Failed to send test SMS. Check your .env credentials.');
                      }
                    }}
                    className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg hover:bg-brand-100 transition-colors uppercase"
                  >
                    Test Delivery
                  </button>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all bg-gray-50/50"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <MapPin size={16} className="text-brand-500" /> City / Location
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all bg-gray-50/50"
                  placeholder="Enter your location"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <CreditCard size={16} className="text-brand-500" /> Aadhar Card Number
                </label>
                <input
                  type="text"
                  name="aadhar_card"
                  value={formData.aadhar_card}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all bg-gray-50/50"
                  placeholder="Enter your Aadhar number"
                  required
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
