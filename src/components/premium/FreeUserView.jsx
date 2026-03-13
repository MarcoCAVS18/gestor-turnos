// src/components/premium/FreeUserView.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, CreditCard, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import { useApp } from '../../contexts/AppContext';
import { getLocalPrice } from '../../services/currencyService';
import { useIsMobile } from '../../hooks/useIsMobile';
import { activateExistingSubscription } from '../../services/stripeService';
import PageHeader from '../layout/PageHeader';
import Card from '../ui/Card';
import HeroCard from './HeroCard';
import AccountCard from './AccountCard';
import BenefitsRow from './BenefitsRow';
import PaymentForm from './PaymentForm';
import SecurityCard from './SecurityCard';

const FreeUserView = ({ onPaymentSuccess, onProcessingStart, onPaymentError }) => {
  const { t } = useTranslation();
  const { currentUser, profilePhotoURL } = useAuth();
  const { holidayCountry } = useApp();
  const isMobile = useIsMobile();
  const [localPrice, setLocalPrice] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState(null);

  useEffect(() => {
    if (holidayCountry && holidayCountry !== 'AU') {
      getLocalPrice(holidayCountry).then(setLocalPrice).catch(() => {});
    }
  }, [holidayCountry]);

  const handleRestoreSubscription = async () => {
    setRestoring(true);
    setRestoreError(null);
    try {
      await activateExistingSubscription();
      onPaymentSuccess?.();
    } catch (err) {
      setRestoreError(err.message || t('premium.restoreError', 'No active subscription found.'));
    } finally {
      setRestoring(false);
    }
  };

  const PaymentFormCard = () => (
    <Card className="p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard size={24} style={{ color: PREMIUM_COLORS.primary }} />
        <h2 className="text-lg font-semibold text-gray-900">{t('premium.paymentDetails')}</h2>
      </div>
      <PaymentForm onSuccess={onPaymentSuccess} onProcessingStart={onProcessingStart} onPaymentError={onPaymentError} localPrice={localPrice} />
      <div className="mt-5 pt-4 border-t border-gray-100">
        {restoreError && (
          <p className="text-xs text-red-500 mb-2">{restoreError}</p>
        )}
        <button
          onClick={handleRestoreSubscription}
          disabled={restoring}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <RotateCcw size={12} className={restoring ? 'animate-spin' : ''} />
          {restoring ? t('common.loading', 'Loading…') : t('premium.restoreAccess', 'Already subscribed? Restore access')}
        </button>
      </div>
    </Card>
  );

  return (
    <div className="px-4 py-6 space-y-6">
      <PageHeader
        title={t('premium.title')}
        subtitle={t('premium.unlockFeatures')}
        icon={Crown}
      />

      {isMobile ? (
        /* MOBILE: Vertical stack */
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <HeroCard localPrice={localPrice} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <BenefitsRow isPremium={false} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <PaymentFormCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SecurityCard />
          </motion.div>
        </div>
      ) : (
        /* DESKTOP: Asymmetric grid layout */
        <div className="space-y-6">
          {/* Row 1: Hero (3/5) + User Info (2/5) */}
          <div className="grid grid-cols-5 gap-6 items-stretch">
            <motion.div className="col-span-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <HeroCard localPrice={localPrice} />
            </motion.div>
            <motion.div className="col-span-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <AccountCard
                currentUser={currentUser}
                profilePhotoURL={profilePhotoURL}
                isPremium={false}
              />
            </motion.div>
          </div>

          {/* Row 2: Benefits - full width */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <BenefitsRow isPremium={false} />
          </motion.div>

          {/* Row 3: Payment Form (2/3) + Security/Guarantee (1/3) */}
          <div className="grid grid-cols-3 gap-6 items-stretch">
            <motion.div className="col-span-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <PaymentFormCard />
            </motion.div>
            <motion.div className="col-span-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SecurityCard />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeUserView;
