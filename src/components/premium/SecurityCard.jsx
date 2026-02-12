// src/components/premium/SecurityCard.jsx

import React from 'react';
import { Shield, Check, Receipt } from 'lucide-react';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import Card from '../ui/Card';

const SecurityCard = () => (
  <Card variant="transparent" className="p-5 h-full flex flex-col justify-between">
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Shield size={20} style={{ color: PREMIUM_COLORS.primary }} />
        <h2 className="text-lg font-semibold text-gray-900">Guarantee</h2>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Check size={14} style={{ color: PREMIUM_COLORS.gold }} className="mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-600">Cancel anytime, no questions asked</p>
        </div>
        <div className="flex items-start gap-2">
          <Check size={14} style={{ color: PREMIUM_COLORS.gold }} className="mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-600">Keep access until billing period ends</p>
        </div>
        <div className="flex items-start gap-2">
          <Check size={14} style={{ color: PREMIUM_COLORS.gold }} className="mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-600">Secure payment via Stripe</p>
        </div>
      </div>
    </div>
    <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: `${PREMIUM_COLORS.lighter}50` }}>
      <div className="flex items-center gap-2">
        <Receipt size={14} style={{ color: PREMIUM_COLORS.primary }} />
        <p className="text-xs text-gray-500">Invoice sent to your email after each payment</p>
      </div>
    </div>
  </Card>
);

export default SecurityCard;
