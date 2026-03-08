// src/components/premium/PremiumUserView.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { usePremium } from '../../contexts/PremiumContext';
import { openBillingPortal } from '../../services/stripeService';
import { AUD_PRICE } from '../../services/currencyService';
import PageHeader from '../layout/PageHeader';
import SubscriptionStatusCard from './SubscriptionStatusCard';
import AccountCard from './AccountCard';
import BenefitsRow from './BenefitsRow';
import PaymentMethodCard from './PaymentMethodCard';
import ManageSubscriptionCard from './ManageSubscriptionCard';
import RecentInvoices from './RecentInvoices';
import logger from '../../utils/logger';

const PremiumUserView = () => {
  const { t } = useTranslation();
  const { currentUser, profilePhotoURL } = useAuth();
  const { subscription, cancelSubscription } = usePremium();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState(null);

  const getMembershipDuration = () => {
    if (!subscription?.startDate) return null;
    const start = subscription.startDate.toDate ? subscription.startDate.toDate() : new Date(subscription.startDate);
    const months = Math.floor((Date.now() - start.getTime()) / (30 * 24 * 60 * 60 * 1000));
    if (months < 1) return t('premium.lessThanMonth');
    if (months === 1) return t('premium.oneMonth');
    return t('premium.months', { count: months });
  };

  const getTotalInvested = () => {
    if (!subscription?.startDate) return null;
    const start = subscription.startDate.toDate ? subscription.startDate.toDate() : new Date(subscription.startDate);
    const months = Math.max(1, Math.ceil((Date.now() - start.getTime()) / (30 * 24 * 60 * 60 * 1000)));
    const total = (months * parseFloat(AUD_PRICE)).toFixed(2);
    return `$${total} AUD`;
  };

  const handleOpenBillingPortal = async () => {
    setPortalLoading(true);
    setPortalError(null);
    try {
      await openBillingPortal();
    } catch (error) {
      logger.error('Billing portal error:', error);
      setPortalError(error.message || 'Failed to open billing portal');
      // Clear error after 5 seconds
      setTimeout(() => setPortalError(null), 5000);
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <PageHeader
        title={t('premium.title')}
        subtitle={t('premium.manageSubscription')}
        icon={Crown}
      />

      {/* Error notification */}
      {portalError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          <p className="font-medium">{t('common.error')}</p>
          <p>{portalError}</p>
        </motion.div>
      )}

      {/* DESKTOP: Asymmetric grid layout */}
      <div className="hidden lg:block space-y-6">
        {/* Row 1: Subscription (3/5) + Account (2/5) */}
        <div className="grid grid-cols-5 gap-6 items-start">
          <motion.div className="col-span-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <SubscriptionStatusCard subscription={subscription} />
          </motion.div>
          <motion.div className="col-span-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <AccountCard
              currentUser={currentUser}
              profilePhotoURL={profilePhotoURL}
              isPremium={true}
              membershipDuration={getMembershipDuration()}
            />
          </motion.div>
        </div>

        {/* Row 2: Benefits - full width */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <BenefitsRow isPremium={true} />
        </motion.div>

        {/* Row 3: Payment & Invoices (3/5) + Manage (2/5) */}
        <div className="grid grid-cols-5 gap-6 items-stretch">
          <motion.div className="col-span-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <PaymentMethodCard
              subscription={subscription}
              totalInvested={getTotalInvested()}
              onOpenBillingPortal={handleOpenBillingPortal}
              portalLoading={portalLoading}
            />
          </motion.div>
          <motion.div className="col-span-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ManageSubscriptionCard
              subscription={subscription}
              onOpenBillingPortal={handleOpenBillingPortal}
              portalLoading={portalLoading}
              onCancelSubscription={cancelSubscription}
            />
          </motion.div>
        </div>

        {/* Row 4: Recent Invoices - full width */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <RecentInvoices />
        </motion.div>
      </div>

      {/* MOBILE: Vertical stack */}
      <div className="block lg:hidden space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <AccountCard
            currentUser={currentUser}
            profilePhotoURL={profilePhotoURL}
            isPremium={true}
            membershipDuration={getMembershipDuration()}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SubscriptionStatusCard subscription={subscription} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <BenefitsRow isPremium={true} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <PaymentMethodCard
            subscription={subscription}
            totalInvested={getTotalInvested()}
            onOpenBillingPortal={handleOpenBillingPortal}
            portalLoading={portalLoading}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ManageSubscriptionCard
            subscription={subscription}
            onOpenBillingPortal={handleOpenBillingPortal}
            portalLoading={portalLoading}
            onCancelSubscription={cancelSubscription}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <RecentInvoices />
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumUserView;
