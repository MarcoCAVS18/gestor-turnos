// src/components/premium/PaymentMethodCard.jsx

import React from 'react';
import { CreditCard, FileText, History, DollarSign } from 'lucide-react';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import Card from '../ui/Card';

const PaymentMethodCard = ({ subscription, totalInvested, onOpenBillingPortal, portalLoading }) => (
  <Card className="p-5 h-full">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment & Invoices</h2>
    <div className="space-y-3">
      {/* Payment method */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
          <CreditCard size={20} className="text-gray-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">
            {subscription?.paymentMethod || 'Card on file'}
          </p>
          <p className="text-xs text-gray-500">Default payment method</p>
        </div>
      </div>

      {/* Total invested */}
      {totalInvested && (
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: `${PREMIUM_COLORS.lighter}50` }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: PREMIUM_COLORS.lighter }}>
            <DollarSign size={20} style={{ color: PREMIUM_COLORS.gold }} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{totalInvested}</p>
            <p className="text-xs text-gray-500">Total invested in Premium</p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onOpenBillingPortal}
          disabled={portalLoading}
          className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
        >
          <FileText size={14} />
          <span>Invoices</span>
        </button>
        <button
          onClick={onOpenBillingPortal}
          disabled={portalLoading}
          className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
        >
          <History size={14} />
          <span>History</span>
        </button>
      </div>
    </div>
  </Card>
);

export default PaymentMethodCard;
