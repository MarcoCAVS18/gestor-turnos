// src/components/premium/HeroCard.jsx

import React from 'react';
import { Crown } from 'lucide-react';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import { AUD_PRICE } from '../../services/currencyService';

const HeroCard = ({ localPrice }) => (
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
      <h1 className="text-2xl font-bold mb-1" style={{ color: PREMIUM_COLORS.text }}>
        Unlock Premium
      </h1>
      <div className="mb-2">
        {localPrice ? (
          <>
            <span className="text-3xl font-bold" style={{ color: PREMIUM_COLORS.text }}>
              ~{localPrice.symbol}{localPrice.amount}
            </span>
            <span className="text-base ml-1" style={{ color: `${PREMIUM_COLORS.text}99` }}>
              {localPrice.currency}/month
            </span>
            <div className="text-xs mt-1" style={{ color: `${PREMIUM_COLORS.text}88` }}>
              A${AUD_PRICE} AUD/month
            </div>
          </>
        ) : (
          <>
            <span className="text-3xl font-bold" style={{ color: PREMIUM_COLORS.text }}>
              ${AUD_PRICE}
            </span>
            <span className="text-base ml-1" style={{ color: `${PREMIUM_COLORS.text}99` }}>
              AUD/month
            </span>
          </>
        )}
      </div>
      <p className="text-sm" style={{ color: `${PREMIUM_COLORS.text}cc` }}>
        Get unlimited access to all features
      </p>
    </div>
  </div>
);

export default HeroCard;
