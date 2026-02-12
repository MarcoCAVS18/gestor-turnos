// src/components/premium/SubscriptionStatusCard.jsx

import React from 'react';
import { Crown, AlertTriangle } from 'lucide-react';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import { AUD_PRICE } from '../../services/currencyService';
import Card from '../ui/Card';
import { formatDate, STATUS_CONFIG } from './constants';

const SubscriptionStatusCard = ({ subscription }) => {
  const currentStatus = STATUS_CONFIG[subscription?.status] || STATUS_CONFIG.active;
  const isCancelling = subscription?.status === 'cancelling';

  return (
    <Card className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStatus.color}`}>
          {currentStatus.label}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: PREMIUM_COLORS.lighter }}>
          <Crown size={20} style={{ color: PREMIUM_COLORS.gold }} />
          <div>
            <p className="font-medium text-gray-900">Premium Plan</p>
            <p className="text-sm text-gray-500">${AUD_PRICE} AUD/month</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Member since</span>
            <span className="font-medium text-gray-900">{formatDate(subscription?.startDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{isCancelling ? 'Access until' : 'Next billing'}</span>
            <span className={`font-medium ${isCancelling ? 'text-amber-600' : 'text-gray-900'}`}>
              {formatDate(subscription?.expiryDate)}
            </span>
          </div>
        </div>

        {isCancelling && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Your subscription will end on {formatDate(subscription?.expiryDate)}. You'll keep full access until then.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SubscriptionStatusCard;
