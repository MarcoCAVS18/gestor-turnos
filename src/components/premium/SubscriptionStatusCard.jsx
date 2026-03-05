// src/components/premium/SubscriptionStatusCard.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, AlertTriangle, Clock } from 'lucide-react';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import { AUD_PRICE } from '../../services/currencyService';
import Card from '../ui/Card';
import { formatDate, STATUS_CONFIG } from './constants';

const SubscriptionStatusCard = ({ subscription }) => {
  const { t } = useTranslation();
  const currentStatus = STATUS_CONFIG[subscription?.status] || STATUS_CONFIG.active;
  const isCancelling = subscription?.status === 'cancelling';
  const isTrialing = subscription?.status === 'trialing';

  // Get translated status label
  const getStatusLabel = () => {
    const statusKey = subscription?.status || 'active';
    return t(`premium.status.${statusKey}`);
  };

  return (
    <Card className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('premium.subscription.title')}</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStatus.color}`}>
          {getStatusLabel()}
        </span>
      </div>

      <div className="space-y-3">
        <div className="premium-bg-light flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: PREMIUM_COLORS.lighter }}>
          <Crown size={20} style={{ color: PREMIUM_COLORS.gold }} />
          <div>
            <p className="font-medium text-gray-900">{t('premium.subscription.planName')}</p>
            <p className="text-sm text-gray-500">
              {isTrialing ? t('premium.subscription.freeDuringTrial') : `$${AUD_PRICE} AUD/${t('premium.hero.month')}`}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">{t('premium.subscription.memberSince')}</span>
            <span className="font-medium text-gray-900">{formatDate(subscription?.startDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">
              {isTrialing ? t('premium.subscription.trialEnds') : isCancelling ? t('premium.subscription.accessUntil') : t('premium.subscription.nextBilling')}
            </span>
            <span className={`font-medium ${isCancelling ? 'text-amber-600' : isTrialing ? 'text-blue-600' : 'text-gray-900'}`}>
              {isTrialing ? formatDate(subscription?.trialEnd) : formatDate(subscription?.expiryDate)}
            </span>
          </div>
        </div>

        {isTrialing && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200">
            <Clock size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              {t('premium.subscription.trialInfo', { price: AUD_PRICE, date: formatDate(subscription?.trialEnd) })}
            </p>
          </div>
        )}

        {isCancelling && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              {t('premium.subscription.cancellationInfo', { date: formatDate(subscription?.expiryDate) })}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SubscriptionStatusCard;
