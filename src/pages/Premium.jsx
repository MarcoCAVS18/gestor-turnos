// src/pages/Premium.jsx
// Premium subscription page - orchestrator

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { usePremium } from '../contexts/PremiumContext';
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
    }
    setPaymentState('success');
    setTimeout(() => window.location.reload(), 6000);
  };

  if (paymentState === 'processing') {
    return <ProcessingPaymentOverlay />;
  }

  if (paymentState === 'success') {
    return <SuccessCelebration isTrial={trialEnd !== null} trialEnd={trialEnd} />;
  }

  if (isPremium) {
    return <PremiumUserView />;
  }

  return (
    <FreeUserView
      onPaymentSuccess={handlePaymentSuccess}
      onProcessingStart={handleProcessingStart}
    />
  );
};

// Wrap with Stripe Elements Provider
const Premium = () => (
  <Elements stripe={stripePromise}>
    <PremiumContent />
  </Elements>
);

export default Premium;
