import { Outlet, Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { LayoutDashboard, ShoppingCart, LogOut, Package, User, PlusCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm">
        <div className="p-6">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Kisan<span className="text-brand-600">Setu</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <LayoutDashboard size={20} /> {t('common.dashboard')}
          </NavLink>

          <NavLink 
            to="/dashboard/marketplace" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <ShoppingCart size={20} /> {t('nav.marketplace')}
          </NavLink>

          <NavLink 
            to="/dashboard/ai-assistant" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 border ${
                isActive ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-md' : 'text-purple-600 bg-purple-50/50 border-purple-100 hover:bg-purple-100/50'
              }`
            }
          >
            <Sparkles size={20} /> AI Assistant
          </NavLink>
          {(user?.role === 'farmer' || user?.role === 'admin') && (
            <>
              <Link to="/dashboard/add-product" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                <PlusCircle size={20} /> {t('nav.addProduct')}
              </Link>
              <Link to="/dashboard/listings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                <Package size={20} /> {t('nav.myListings')}
              </Link>
            </>
          )}
          {user?.role === 'buyer' && (
            <>
              <Link to="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                <ShoppingCart size={20} /> {t('nav.myOrders')}
              </Link>
            </>
          )}
          {user?.role === 'admin' && (
            <NavLink 
              to="/dashboard/admin" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 border ${
                  isActive ? 'bg-brand-100 text-brand-700 border-brand-200 shadow-sm' : 'text-brand-600 bg-brand-50 border-brand-100 hover:bg-brand-100'
                }`
              }
            >
              <ShieldAlert size={20} /> Admin Console
            </NavLink>
          )}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => dispatch(logout())}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut size={20} /> {t('common.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">{user?.role} Portal</h2>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link to="/dashboard/profile" className="flex items-center gap-3 border-l border-gray-100 pl-4 ml-2 group transition-all duration-300 hover:bg-gray-50 rounded-xl py-1 px-2">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold group-hover:scale-110 transition-transform shadow-sm">
                <User size={20} />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-brand-700 transition-colors">{user?.name}</span>
            </Link>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
