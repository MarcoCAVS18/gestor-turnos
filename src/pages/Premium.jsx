// src/pages/Premium.jsx
// Premium subscription page - orchestrator

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { usePremium } from '../contexts/PremiumContext';
import { trackPurchase, trackTrialStart } from '../utils/analytics';
import SuccessCelebration from '../components/premium/SuccessCelebration';
import ProcessingPaymentOverlay from '../components/premium/ProcessingPaymentOverlay';
import PremiumUserView from '../components/premium/PremiumUserView';
import FreeUserView from '../components/premium/FreeUserView';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PremiumContent = () => {
  const { isPremium } = usePremium();
  // 'idle' | 'processing' | 'success'
  const [paymentState, setPaymentState] = useState('idle');
  const [trialEnd, setTrialEnd] = useState(null);

  const handleProcessingStart = () => setPaymentState('processing');

  const handlePaymentSuccess = (result) => {
    if (result?.status === 'trial') {
      setTrialEnd(result.trialEnd);
      trackTrialStart();
    } else {
      trackPurchase('subscription');
    }
    setPaymentState('success');
    setTimeout(() => window.location.reload(), 6000);
  };

  // Called when payment errors AFTER the overlay is shown — return to form
  const handlePaymentError = () => setPaymentState('idle');

  if (paymentState === 'processing') {
    return <ProcessingPaymentOverlay onRetry={handlePaymentError} />;
  }

  if (paymentState === 'success') {
    return <SuccessCelebration isTrial={trialEnd !== null} trialEnd={trialEnd} />;
  }

  if (isPremium) {
    return <PremiumUserView />;
  }

  return (
    <>
      <Helmet>
        <title>Go Premium - Orary</title>
        <meta name="description" content="Unlock advanced analytics, PDF/Excel exports, and premium features for $2.99 AUD/month." />
      </Helmet>
      <FreeUserView
        onPaymentSuccess={handlePaymentSuccess}
        onProcessingStart={handleProcessingStart}
        onPaymentError={handlePaymentError}
      />
    </>
  );
};

// Wrap with Stripe Elements Provider
const Premium = () => (
  <Elements stripe={stripePromise}>
    <PremiumContent />
  </Elements>
);

export default Premium;
