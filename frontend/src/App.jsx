import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from './features/authSlice';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerMarketplace from './pages/BuyerMarketplace';
import AddProduct from './pages/AddProduct';
import MyListings from './pages/MyListings';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import AIAssistant from './pages/AIAssistant';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, token, user]);

  if (token && !user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-brand-600 font-bold">Loading KisanSetu...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route index element={
            user?.role === 'buyer' ? <BuyerMarketplace /> : <FarmerDashboard />
          } />
          <Route path="marketplace" element={<BuyerMarketplace />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="listings" element={<MyListings />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
