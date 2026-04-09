import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors border border-gray-100">
        <Languages size={18} />
        <span className="uppercase text-sm">{i18n.language.split('-')[0]}</span>
      </button>
      <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
        <button
          onClick={() => changeLanguage('en')}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-50 transition-colors ${i18n.language === 'en' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-700'}`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('hi')}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-50 transition-colors ${i18n.language === 'hi' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-700'}`}
        >
          Hindi / हिंदी
        </button>
        <button
          onClick={() => changeLanguage('mr')}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-50 transition-colors ${i18n.language === 'mr' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-700'}`}
        >
          Marathi / मराठी
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
