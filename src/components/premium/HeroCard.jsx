// src/components/premium/HeroCard.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Crown } from 'lucide-react';
import { PREMIUM_COLORS, usePremium } from '../../contexts/PremiumContext';
import { AUD_PRICE } from '../../services/currencyService';

const HeroCard = ({ localPrice }) => {
  const { t } = useTranslation();
  const { hasUsedTrial } = usePremium();
  
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 h-full"
      style={{
        background: `linear-gradient(135deg, ${PREMIUM_COLORS.lighter} 0%, ${PREMIUM_COLORS.light} 50%, ${PREMIUM_COLORS.primary} 100%)`,
      }}
    >
      <img
        src="/assets/SVG/logo.svg"
        alt=""
        className="absolute -right-16 -bottom-16 opacity-[0.08] pointer-events-none"
        style={{ width: '200px', height: '200px', transform: 'rotate(-15deg)', filter: 'grayscale(100%)' }}
      />
      <div className="relative z-10">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg mb-4"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          <Crown size={28} style={{ color: PREMIUM_COLORS.gold }} />
        </div>
        {!hasUsedTrial && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2 text-xs font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: PREMIUM_COLORS.text }}>
            {t('premium.hero.freeTrial')}
          </div>
        )}
        <h1 className="text-2xl font-bold mb-1" style={{ color: PREMIUM_COLORS.text }}>
          {t('premium.hero.unlockPremium')}
        </h1>
        <div className="mb-2">
          {localPrice ? (
            <>
              <span className="text-3xl font-bold" style={{ color: PREMIUM_COLORS.text }}>
                ~{localPrice.symbol}{localPrice.amount}
              </span>
              <span className="text-base ml-1" style={{ color: `${PREMIUM_COLORS.text}99` }}>
                {localPrice.currency}/{t('premium.hero.month')}
              </span>
              <div className="text-xs mt-1" style={{ color: `${PREMIUM_COLORS.text}88` }}>
                A${AUD_PRICE} AUD/{t('premium.hero.month')}
              </div>
            </>
          ) : (
            <>
              <span className="text-3xl font-bold" style={{ color: PREMIUM_COLORS.text }}>
                ${AUD_PRICE}
              </span>
              <span className="text-base ml-1" style={{ color: `${PREMIUM_COLORS.text}99` }}>
                AUD/{t('premium.hero.month')}
              </span>
            </>
          )}
        </div>
        <p className="text-sm" style={{ color: `${PREMIUM_COLORS.text}cc` }}>
          {hasUsedTrial
            ? t('premium.hero.noTrialDescription', { price: AUD_PRICE })
            : t('premium.hero.trialDescription', { price: AUD_PRICE })}
        </p>
      </div>
    </div>
  );
};

export default HeroCard;
