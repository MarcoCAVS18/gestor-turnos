// src/components/premium/SecurityCard.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Check, Receipt } from 'lucide-react';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import Card from '../ui/Card';

const SecurityCard = () => {
  const { t } = useTranslation();

  return (
    <Card variant="transparent" className="p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={20} style={{ color: PREMIUM_COLORS.primary }} />
          <h2 className="text-lg font-semibold text-gray-900">{t('premium.security.title')}</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Check size={14} style={{ color: PREMIUM_COLORS.gold }} className="mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">{t('premium.security.cancelAnytime')}</p>
          </div>
          <div className="flex items-start gap-2">
            <Check size={14} style={{ color: PREMIUM_COLORS.gold }} className="mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">{t('premium.security.keepAccess')}</p>
          </div>
          <div className="flex items-start gap-2">
            <Check size={14} style={{ color: PREMIUM_COLORS.gold }} className="mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">{t('premium.security.securePayment')}</p>
          </div>
        </div>
      </div>
      <div className="premium-bg-light mt-4 p-3 rounded-xl" style={{ backgroundColor: `${PREMIUM_COLORS.lighter}50` }}>
        <div className="flex items-center gap-2">
          <Receipt size={14} style={{ color: PREMIUM_COLORS.primary }} />
          <p className="text-xs text-gray-500">{t('premium.security.invoiceNote')}</p>
        </div>
      </div>
    </Card>
  );
};

export default SecurityCard;
