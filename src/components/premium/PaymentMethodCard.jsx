// src/components/premium/PaymentMethodCard.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, FileText, History, DollarSign } from 'lucide-react';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import Card from '../ui/Card';

const PaymentMethodCard = ({ subscription, totalInvested, onOpenBillingPortal, portalLoading }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <Card className="p-5 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('premium.payment.title')}</h2>
      <div className="space-y-3">
        {/* Payment method */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
            <CreditCard size={20} className="text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">
              {subscription?.paymentMethod || t('premium.payment.cardOnFile')}
            </p>
            <p className="text-xs text-gray-500">{t('premium.payment.defaultMethod')}</p>
          </div>
        </div>

        {/* Total invested */}
        {totalInvested && (
          <div className="premium-bg-light flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: `${PREMIUM_COLORS.lighter}50` }}>
            <div className="premium-bg-light w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: PREMIUM_COLORS.lighter }}>
              <DollarSign size={20} style={{ color: PREMIUM_COLORS.gold }} />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{totalInvested}</p>
              <p className="text-xs text-gray-500">{t('premium.payment.totalInvested')}</p>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onOpenBillingPortal}
            disabled={portalLoading}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
            style={{ backgroundColor: portalLoading ? colors.transparent5 : colors.transparent10, color: colors.primary }}
            onMouseEnter={(e) => !portalLoading && (e.currentTarget.style.backgroundColor = colors.transparent20)}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = portalLoading ? colors.transparent5 : colors.transparent10}
          >
            {portalLoading ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <FileText size={14} />
            )}
            <span>{t('premium.payment.invoices')}</span>
          </button>
          <button
            onClick={onOpenBillingPortal}
            disabled={portalLoading}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
            style={{ backgroundColor: portalLoading ? colors.transparent5 : colors.transparent10, color: colors.primary }}
            onMouseEnter={(e) => !portalLoading && (e.currentTarget.style.backgroundColor = colors.transparent20)}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = portalLoading ? colors.transparent5 : colors.transparent10}
          >
            {portalLoading ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <History size={14} />
            )}
            <span>{t('premium.payment.history')}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PaymentMethodCard;
