import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sprout, TrendingUp, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

export default function Landing() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 lg:px-12 glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-brand-600" />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Kisan<span className="text-brand-600">Setu</span></span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
            {t('common.login')}
          </Link>
          <Link to="/register" className="px-5 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-full hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5">
            {t('landing.getStarted')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-6 animate-pulse">
          {t('landing.badge')}
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight max-w-4xl tracking-tighter">
          {t('landing.heroTitle')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-green-400">{t('landing.heroTitleAccent')}</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl">
          {t('landing.heroDescription')}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-white bg-brand-600 rounded-full hover:bg-brand-700 shadow-xl shadow-brand-500/30 transition-all hover-lift">
            {t('landing.joinAsFarmer')} <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-brand-700 bg-brand-100 rounded-full hover:bg-brand-200 transition-all hover-lift border border-brand-200">
            {t('landing.browseMarket')}
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-6xl mx-auto">
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover-lift text-left">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mb-6">
              <Sprout className="w-7 h-7 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.features.direct')}</h3>
            <p className="text-gray-600">{t('landing.features.directDesc')}</p>
          </div>
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover-lift text-left">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.features.profit')}</h3>
            <p className="text-gray-600">{t('landing.features.profitDesc')}</p>
          </div>
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover-lift text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.features.secure')}</h3>
            <p className="text-gray-600">{t('landing.features.secureDesc')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
