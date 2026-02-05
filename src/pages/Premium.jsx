// src/pages/Premium.jsx
// Premium subscription page - Two column layout with payment form

import React, { useState } from 'react';
import { Crown, Check, Clock, BarChart3, Zap, Shield, CreditCard, Mail, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../contexts/AuthContext';
import { usePremium, PREMIUM_COLORS } from '../contexts/PremiumContext';
import { createSubscription } from '../services/stripeService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageHeader from '../components/layout/PageHeader';

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

// Card Element styles
const CARD_ELEMENT_OPTIONS = {
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
  hidePostalCode: true,
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
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment method from card element
      const cardElement = elements.getElement(CardElement);
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: currentUser?.email,
          name: currentUser?.displayName,
        },
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      // Create subscription
      const result = await createSubscription(
        paymentMethod.id,
        currentUser?.email,
        currentUser?.displayName
      );

      if (result.status === 'success') {
        onSuccess();
      } else if (result.status === 'requires_action') {
        // 3D Secure handled in stripeService
        onSuccess();
      } else {
        throw new Error('Payment processing failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Card Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div
          className="p-4 border rounded-xl transition-colors focus-within:border-gray-400"
          style={{ borderColor: '#e5e7eb' }}
        >
          <CardElement options={CARD_ELEMENT_OPTIONS} />
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
        Subscribe - $1.99/month
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
  const { isPremium, subscription } = usePremium();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    // Reload after a moment to refresh premium status
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  // Success State
  if (paymentSuccess) {
    return (
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title="Premium"
          subtitle="Welcome to Premium!"
          icon={Crown}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: PREMIUM_COLORS.lighter }}
          >
            <Check size={40} style={{ color: PREMIUM_COLORS.primary }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Premium!
          </h1>
          <p className="text-gray-500 mb-4">
            Your subscription is now active. Enjoy unlimited access!
          </p>
          <p className="text-sm text-gray-400">
            Redirecting...
          </p>
        </motion.div>
      </div>
    );
  }

  // Premium User State
  if (isPremium) {
    return (
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title="Premium"
          subtitle="Manage your subscription"
          icon={Crown}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: PREMIUM_COLORS.lighter }}
          >
            <Crown size={40} style={{ color: PREMIUM_COLORS.gold }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're Premium!
          </h1>
          <p className="text-gray-500 mb-6">
            Enjoy unlimited access to all features
          </p>

          {/* Subscription Info */}
          <Card className="p-4 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full overflow-hidden border-2"
                style={{ borderColor: PREMIUM_COLORS.light }}
              >
                <img src={profilePhotoURL} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUser?.displayName}</p>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {subscription?.startDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Member since</span>
                  <span className="font-medium">
                    {new Date(
                      subscription.startDate.toDate
                        ? subscription.startDate.toDate()
                        : subscription.startDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              {subscription?.expiryDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Next billing</span>
                  <span className="font-medium">
                    {new Date(
                      subscription.expiryDate.toDate
                        ? subscription.expiryDate.toDate()
                        : subscription.expiryDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Free User - Show subscription form
  return (
    <div className="px-4 py-6 space-y-6">
      <PageHeader
        title="Premium"
        subtitle="Unlock unlimited access to all features"
        icon={Crown}
      />

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8 w-full">
        {/* LEFT COLUMN - Hero & Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Hero Section */}
          <div
            className="relative overflow-hidden rounded-2xl p-6 mb-6"
            style={{
              background: `linear-gradient(135deg, ${PREMIUM_COLORS.lighter} 0%, ${PREMIUM_COLORS.light} 50%, ${PREMIUM_COLORS.primary} 100%)`,
            }}
          >
            {/* Decorative logo */}
            <img
              src="/assets/SVG/logo.svg"
              alt=""
              className="absolute -right-16 -bottom-16 opacity-[0.08] pointer-events-none"
              style={{
                width: '200px',
                height: '200px',
                transform: 'rotate(-15deg)',
                filter: 'grayscale(100%)',
              }}
            />

            <div className="relative z-10">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg mb-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              >
                <Crown size={28} style={{ color: PREMIUM_COLORS.gold }} />
              </div>

              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: PREMIUM_COLORS.text }}
              >
                Unlock Premium
              </h1>

              <div className="mb-2">
                <span
                  className="text-3xl font-bold"
                  style={{ color: PREMIUM_COLORS.text }}
                >
                  $1.99
                </span>
                <span
                  className="text-base ml-1"
                  style={{ color: `${PREMIUM_COLORS.text}99` }}
                >
                  /month
                </span>
              </div>

              <p
                className="text-sm"
                style={{ color: `${PREMIUM_COLORS.text}cc` }}
              >
                Get unlimited access to all features
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-3">
            {PREMIUM_BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${PREMIUM_COLORS.gold}15` }}
                >
                  <benefit.icon size={20} style={{ color: PREMIUM_COLORS.primary }} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{benefit.title}</p>
                  <p className="text-sm text-gray-500">{benefit.description}</p>
                </div>
                <Check size={18} style={{ color: PREMIUM_COLORS.primary }} className="ml-auto flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN - Payment Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard size={24} style={{ color: PREMIUM_COLORS.primary }} />
              <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={profilePhotoURL} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{currentUser?.displayName}</p>
                <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                  <Mail size={12} />
                  {currentUser?.email}
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <PaymentForm onSuccess={handlePaymentSuccess} />
          </Card>

          {/* Test Cards Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
              <p className="font-semibold mb-1">Test Cards:</p>
              <p>✓ Success: 4242 4242 4242 4242</p>
              <p>✓ 3D Secure: 4000 0025 0000 3155</p>
              <p>✗ Declined: 4000 0000 0000 9995</p>
              <p className="mt-1 text-blue-500">Use any future date and any 3-digit CVC</p>
            </div>
          )}
        </motion.div>
      </div>
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
