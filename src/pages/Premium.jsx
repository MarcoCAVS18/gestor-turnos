// src/pages/Premium.jsx
// Premium subscription page - Two column layout with payment form

import React, { useState, useEffect } from 'react';
import { Crown, Check, Clock, BarChart3, Zap, Shield, CreditCard, Mail, Receipt, ExternalLink, AlertTriangle, CalendarDays, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../contexts/AuthContext';
import { usePremium, PREMIUM_COLORS } from '../contexts/PremiumContext';
import { createSubscription, openBillingPortal } from '../services/stripeService';
import { useApp } from '../contexts/AppContext';
import { getLocalPrice, AUD_PRICE } from '../services/currencyService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageHeader from '../components/layout/PageHeader';
import { useIsMobile } from '../hooks/useIsMobile';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PREMIUM_BENEFITS = [
  {
    icon: Clock,
    title: 'Unlimited Live Mode',
    description: 'Track unlimited shifts in real-time',
  },
  {
    icon: BarChart3,
    title: 'Advanced Statistics',
    description: 'Detailed analytics and insights',
  },
  {
    icon: Zap,
    title: 'Priority Support',
    description: 'Get help faster with priority support',
  },
  {
    icon: Shield,
    title: 'Data Export',
    description: 'Export your data anytime',
  },
];

// Card Element styles (shared for all card elements)
const CARD_ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a1a',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

const CARD_NUMBER_OPTIONS = {
  ...CARD_ELEMENT_STYLE,
  showIcon: true,
  placeholder: '1234 1234 1234 1234',
};

const CARD_EXPIRY_OPTIONS = {
  ...CARD_ELEMENT_STYLE,
  placeholder: 'MM / YY',
};

const CARD_CVC_OPTIONS = {
  ...CARD_ELEMENT_STYLE,
  placeholder: 'CVC',
};

// Payment Form Component
const PaymentForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system not ready. Please refresh and try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment method from card number element
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error('Card input not found. Please refresh and try again.');
      }

      console.log('[Premium] Creating payment method...');
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          email: currentUser?.email,
          name: currentUser?.displayName,
        },
      });

      if (pmError) {
        console.error('[Premium] Payment method error:', pmError);
        throw new Error(pmError.message);
      }

      console.log('[Premium] Payment method created:', paymentMethod.id);

      // Create subscription
      const result = await createSubscription(
        paymentMethod.id,
        currentUser?.email,
        currentUser?.displayName
      );

      console.log('[Premium] Subscription result:', result);

      // Check if result exists and has expected properties
      if (!result) {
        throw new Error('No response from payment server. Please try again.');
      }

      // Handle various success statuses
      const successStatuses = ['success', 'active', 'succeeded', 'processing'];
      if (successStatuses.includes(result.status)) {
        onSuccess();
      } else if (result.status === 'requires_action') {
        // This shouldn't happen as stripeService handles 3D Secure internally
        // But if it does, treat it as pending and let user know
        console.warn('[Premium] Unexpected requires_action status after stripeService');
        onSuccess();
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        // Log for debugging
        console.error('[Premium] Unexpected result status:', result.status, result);
        throw new Error(`Payment processing failed (${result.status || 'unknown'}). Please try again.`);
      }
    } catch (err) {
      console.error('[Premium] Payment error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Card Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div
          className="p-4 border rounded-xl transition-colors focus-within:border-gray-400"
          style={{ borderColor: '#e5e7eb' }}
        >
          <CardNumberElement options={CARD_NUMBER_OPTIONS} />
        </div>
      </div>

      {/* Expiry and CVC Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <div
            className="p-4 border rounded-xl transition-colors focus-within:border-gray-400"
            style={{ borderColor: '#e5e7eb' }}
          >
            <CardExpiryElement options={CARD_EXPIRY_OPTIONS} />
          </div>
        </div>

        {/* CVC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC
          </label>
          <div
            className="p-4 border rounded-xl transition-colors focus-within:border-gray-400"
            style={{ borderColor: '#e5e7eb' }}
          >
            <CardCvcElement options={CARD_CVC_OPTIONS} />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Invoice Notice */}
      <div
        className="flex items-start gap-3 p-3 rounded-lg mb-4"
        style={{ backgroundColor: `${PREMIUM_COLORS.lighter}50` }}
      >
        <Receipt size={18} style={{ color: PREMIUM_COLORS.primary }} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600">
          We'll send you an invoice receipt to <strong>{currentUser?.email}</strong> after each payment.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="premium"
        className="w-full"
        size="lg"
        loading={loading}
        loadingText="Processing..."
        disabled={!stripe || loading}
      >
        Subscribe - ${AUD_PRICE} AUD/month
      </Button>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-3">
        <Shield size={14} />
        <span>Secure payment powered by Stripe</span>
      </div>
    </form>
  );
};

// Main Premium Page Component
const PremiumContent = () => {
  const { currentUser, profilePhotoURL } = useAuth();
  const { isPremium, subscription, cancelSubscription } = usePremium();
  const { holidayCountry } = useApp();
  const isMobile = useIsMobile();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [localPrice, setLocalPrice] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (holidayCountry && holidayCountry !== 'AU') {
      getLocalPrice(holidayCountry).then(setLocalPrice).catch(() => {});
    }
  }, [holidayCountry]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  // Confetti particle component
  const ConfettiParticle = ({ delay, left, color, size = 8 }) => (
    <motion.div
      initial={{ y: -10, opacity: 0, rotate: 0 }}
      animate={{
        y: [0, -50, 280],
        x: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 120],
        opacity: [0, 1, 1, 0],
        rotate: [0, Math.random() * 360, Math.random() * 720],
      }}
      transition={{ duration: 2.5, delay, ease: 'easeOut' }}
      className="absolute rounded-sm"
      style={{
        left: `${left}%`,
        top: '20%',
        width: size,
        height: size * (Math.random() > 0.5 ? 1 : 2.5),
        backgroundColor: color,
      }}
    />
  );

  const confettiColors = ['#FFD700', '#FFA500', '#FF6347', '#7B68EE', '#00CED1', '#FF69B4', '#32CD32', '#FF4500'];

  // Success State - Celebration modal
  if (paymentSuccess) {
    return (
      <>
        <div className="px-4 py-6 space-y-6 blur-sm pointer-events-none">
          <PageHeader title="Premium" subtitle="Unlock unlimited access to all features" icon={Crown} />
        </div>

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60"
          />

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 18 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl max-w-xs w-full"
            style={{ background: PREMIUM_COLORS.gradient }}
          >
            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <ConfettiParticle
                  key={i}
                  delay={0.3 + i * 0.07}
                  left={Math.random() * 100}
                  color={confettiColors[i % confettiColors.length]}
                  size={5 + Math.random() * 5}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 py-14 px-6 text-center">
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: [-20, 8, -3, 0], scale: [0, 1.3, 0.9, 1] }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Crown size={80} className="mx-auto mb-5 drop-shadow-lg" style={{ color: 'white' }} />
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="text-3xl font-black text-white mb-2 drop-shadow-md"
                style={{ transform: 'rotate(-2deg)' }}
              >
                You're Premium!
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-white/80 text-sm mb-8"
              >
                Enjoy unlimited access to all features
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center justify-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
                <span className="text-xs text-white/50">Redirecting...</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // Helper to format subscription dates
  const formatDate = (dateField) => {
    if (!dateField) return '—';
    const date = dateField.toDate ? dateField.toDate() : new Date(dateField);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Helper to get membership duration
  const getMembershipDuration = () => {
    if (!subscription?.startDate) return null;
    const start = subscription.startDate.toDate ? subscription.startDate.toDate() : new Date(subscription.startDate);
    const months = Math.floor((Date.now() - start.getTime()) / (30 * 24 * 60 * 60 * 1000));
    if (months < 1) return 'Less than a month';
    if (months === 1) return '1 month';
    return `${months} months`;
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      await cancelSubscription();
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Cancel failed:', error);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleOpenBillingPortal = async () => {
    setPortalLoading(true);
    try {
      await openBillingPortal();
    } catch (error) {
      console.error('Billing portal error:', error);
      alert(`Billing portal error: ${error.message}`);
    } finally {
      setPortalLoading(false);
    }
  };

  // Status badge config
  const statusConfig = {
    active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
    cancelling: { label: 'Cancelling', color: 'bg-amber-100 text-amber-700' },
    past_due: { label: 'Past Due', color: 'bg-red-100 text-red-700' },
  };

  const currentStatus = statusConfig[subscription?.status] || statusConfig.active;
  const isCancelling = subscription?.status === 'cancelling';

  // Shared section components for both desktop and mobile
  const SubscriptionStatusCard = () => (
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

  const AccountCard = () => (
    <Card 
    variant="transparent"
    className="p-5 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <div
            className="w-16 h-16 rounded-full overflow-hidden border-3"
            style={{ borderColor: PREMIUM_COLORS.light }}
          >
            <img src={profilePhotoURL} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: PREMIUM_COLORS.gold }}
          >
            <Crown size={12} className="text-white" />
          </div>
        </div>
        <p className="font-medium text-gray-900">{currentUser?.displayName}</p>
        <p className="text-sm text-gray-500 mb-3">{currentUser?.email}</p>
        {getMembershipDuration() && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <CalendarDays size={12} />
            <span>Premium for {getMembershipDuration()}</span>
          </div>
        )}
      </div>
    </Card>
  );

  const BenefitsRow = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {PREMIUM_BENEFITS.map((benefit, index) => (
        <motion.div
          key={benefit.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: PREMIUM_COLORS.lighter }}
          >
            <Check size={14} style={{ color: PREMIUM_COLORS.gold }} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{benefit.title}</p>
            <p className="text-xs text-gray-500 hidden lg:block">{benefit.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const PaymentMethodCard = () => (
    <Card className="p-5 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
          <CreditCard size={20} className="text-gray-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">
            {subscription?.paymentMethod || 'Card on file'}
          </p>
          <p className="text-xs text-gray-500">Updated via Billing Portal</p>
        </div>
      </div>
    </Card>
  );

  const ManageSubscriptionCard = () => (
    <Card className="p-5 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Manage</h2>
      <div className="space-y-3">
        <Button
          onClick={handleOpenBillingPortal}
          loading={portalLoading}
          loadingText="Opening..."
          variant="outline"
          size="md"
          className="w-full justify-center"
        >
          <ExternalLink size={16} className="mr-2" />
          Billing Portal
        </Button>
        <p className="text-xs text-gray-400 text-center">
          View invoices, update payment method
        </p>

        <div className="border-t border-gray-100 pt-3 mt-3">
          {isCancelling ? (
            <p className="text-xs text-center text-amber-600">
              Cancellation scheduled. Access continues until billing period ends.
            </p>
          ) : showCancelConfirm ? (
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700">
                  You'll keep access until {formatDate(subscription?.expiryDate)}. After that, your plan reverts to Free.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCancelConfirm(false)}
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center"
                >
                  Keep Plan
                </Button>
                <Button
                  onClick={handleCancelSubscription}
                  loading={cancelLoading}
                  loadingText="Cancelling..."
                  size="sm"
                  className="flex-1 justify-center bg-red-500 hover:bg-red-600 text-white"
                >
                  <XCircle size={14} className="mr-1" />
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
            >
              Cancel subscription
            </button>
          )}
        </div>
      </div>
    </Card>
  );

  // Premium User State
  if (isPremium) {
    return (
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title="Premium"
          subtitle="Manage your subscription"
          icon={Crown}
        />

        {/* DESKTOP: Asymmetric grid layout */}
        <div className="hidden lg:block space-y-6">
          {/* Row 1: Subscription (3/5) + Account (2/5) */}
          <div className="grid grid-cols-5 gap-6 items-start">
            <motion.div
              className="col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <SubscriptionStatusCard />
            </motion.div>
            <motion.div
              className="col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AccountCard />
            </motion.div>
          </div>

          {/* Row 2: Benefits - full width */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BenefitsRow />
          </motion.div>

          {/* Row 3: Payment (1/3) + Manage (2/3) */}
          <div className="grid grid-cols-3 gap-6 items-stretch">
            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <PaymentMethodCard />
            </motion.div>
            <motion.div
              className="col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ManageSubscriptionCard />
            </motion.div>
          </div>
        </div>

        {/* MOBILE: Vertical stack */}
        <div className="block lg:hidden space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <AccountCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <SubscriptionStatusCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <BenefitsRow />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <PaymentMethodCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ManageSubscriptionCard />
          </motion.div>
        </div>
      </div>
    );
  }

  // Shared sections for free user layout
  const HeroCard = () => (
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

  const UserInfoCard = () => (
    <Card variant="transparent" className="p-5 h-full flex flex-col items-center justify-center text-center">
      <div className="relative mb-3">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
          <img src={profilePhotoURL} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
          <Crown size={12} className="text-gray-500" />
        </div>
      </div>
      <p className="font-medium text-gray-900">{currentUser?.displayName}</p>
      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
        <Mail size={12} />
        {currentUser?.email}
      </p>
      <p className="text-xs text-gray-400 mt-3">Free Plan</p>
    </Card>
  );

  const FreeBenefitsRow = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {PREMIUM_BENEFITS.map((benefit, index) => (
        <motion.div
          key={benefit.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${PREMIUM_COLORS.gold}15` }}
          >
            <benefit.icon size={14} style={{ color: PREMIUM_COLORS.primary }} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{benefit.title}</p>
            <p className="text-xs text-gray-500 hidden lg:block">{benefit.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const PaymentFormCard = () => (
    <Card className="p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard size={24} style={{ color: PREMIUM_COLORS.primary }} />
        <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
      </div>
      <PaymentForm onSuccess={handlePaymentSuccess} />
    </Card>
  );

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

  // Free User - Show subscription form
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
            <HeroCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <FreeBenefitsRow />
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
            <motion.div
              className="col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <HeroCard />
            </motion.div>
            <motion.div
              className="col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <UserInfoCard />
            </motion.div>
          </div>

          {/* Row 2: Benefits - full width */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FreeBenefitsRow />
          </motion.div>

          {/* Row 3: Payment Form (2/3) + Security/Guarantee (1/3) */}
          <div className="grid grid-cols-3 gap-6 items-stretch">
            <motion.div
              className="col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <PaymentFormCard />
            </motion.div>
            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SecurityCard />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap with Stripe Elements Provider
const Premium = () => {
  return (
    <Elements stripe={stripePromise}>
      <PremiumContent />
    </Elements>
  );
};

export default Premium;
