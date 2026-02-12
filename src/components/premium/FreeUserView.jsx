// src/components/premium/FreeUserView.jsx

import React, { useState, useEffect } from 'react';
import { Crown, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import { useApp } from '../../contexts/AppContext';
import { getLocalPrice } from '../../services/currencyService';
import { useIsMobile } from '../../hooks/useIsMobile';
import PageHeader from '../layout/PageHeader';
import Card from '../ui/Card';
import HeroCard from './HeroCard';
import AccountCard from './AccountCard';
import BenefitsRow from './BenefitsRow';
import PaymentForm from './PaymentForm';
import SecurityCard from './SecurityCard';

const FreeUserView = ({ onPaymentSuccess }) => {
  const { currentUser, profilePhotoURL } = useAuth();
  const { holidayCountry } = useApp();
  const isMobile = useIsMobile();
  const [localPrice, setLocalPrice] = useState(null);

  useEffect(() => {
    if (holidayCountry && holidayCountry !== 'AU') {
      getLocalPrice(holidayCountry).then(setLocalPrice).catch(() => {});
    }
  }, [holidayCountry]);

  const PaymentFormCard = () => (
    <Card className="p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard size={24} style={{ color: PREMIUM_COLORS.primary }} />
        <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
      </div>
      <PaymentForm onSuccess={onPaymentSuccess} />
    </Card>
  );

  return (
    <div className="px-4 py-6 space-y-6">
      <PageHeader
        title="Premium"
        subtitle="Unlock unlimited access to all features"
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
