// src/pages/Premium.jsx
// Premium subscription page - orchestrator

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { usePremium } from '../contexts/PremiumContext';
import SuccessCelebration from '../components/premium/SuccessCelebration';
import PremiumUserView from '../components/premium/PremiumUserView';
import FreeUserView from '../components/premium/FreeUserView';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PremiumContent = () => {
  const { isPremium } = usePremium();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  if (paymentSuccess) {
    return <SuccessCelebration />;
  }

  if (isPremium) {
    return <PremiumUserView />;
  }

  return <FreeUserView onPaymentSuccess={handlePaymentSuccess} />;
};

// Wrap with Stripe Elements Provider
const Premium = () => (
  <Elements stripe={stripePromise}>
    <PremiumContent />
  </Elements>
);

export default Premium;
