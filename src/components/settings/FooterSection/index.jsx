// src/components/settings/FooterSection/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Crown, Info, HeadphonesIcon } from 'lucide-react';
import { usePremium } from '../../../contexts/PremiumContext';

const FooterSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openPremiumModal, isPremium } = usePremium();

  const handlePremiumClick = () => {
    if (isPremium) {
      navigate('/premium');
    } else {
      openPremiumModal();
    }
  };

  return (
    <footer className="w-full py-2 px-4 mt-auto border-t border-gray-100 select-none">
      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-wrap justify-end items-center gap-x-3 gap-y-1 text-xs text-gray-500">

          <button
            className="group flex items-center gap-1 font-bold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
            onClick={handlePremiumClick}
          >
            <Crown size={12} className="group-hover:scale-110 transition-transform fill-current" />
            <span>Premium</span>
          </button>

          <span className="text-gray-300">•</span>

          <button
            onClick={() => navigate('/terms', { state: { from: 'Settings' } })}
            className="hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            {t('footer.terms')}
          </button>

          <span className="text-gray-300">•</span>

          <button
            onClick={() => navigate('/privacy', { state: { from: 'Settings' } })}
            className="hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            {t('footer.privacy')}
          </button>

          <span className="text-gray-300">•</span>

          <button
            onClick={() => navigate('/about')}
            className="flex items-center gap-1 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Info size={12} />
            <span>{t('footer.about')}</span>
          </button>

          <span className="text-gray-300">•</span>

          <button
            onClick={() => navigate('/support')}
            className="flex items-center gap-1 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <HeadphonesIcon size={12} />
            <span>{t('footer.support')}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;