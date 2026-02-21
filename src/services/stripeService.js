// src/services/stripeService.js
// Frontend service for Stripe payment integration

import { loadStripe } from '@stripe/stripe-js';
import { auth } from './firebase';
import logger from '../utils/logger';

// Detect Stripe mode from publishable key
const STRIPE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
export const isStripeTestMode = STRIPE_KEY?.startsWith('pk_test_');

// Initialize Stripe with publishable key
const stripePromise = loadStripe(STRIPE_KEY);

// Cloud Functions base URL
// In development: uses local emulator with test keys
// In production: uses deployed functions with live keys
const PROJECT_ID = process.env.REACT_APP_FIREBASE_PROJECT_ID || 'gestionturnos-7ec99';
const FUNCTIONS_BASE_URL = process.env.REACT_APP_USE_EMULATOR === 'true'
  ? `http://localhost:5001/${PROJECT_ID}/us-central1`
  : `https://us-central1-${PROJECT_ID}.cloudfunctions.net`;

/**
 * Get the Stripe instance
 */
export const getStripe = () => stripePromise;

/**
 * Get Firebase Auth token for API calls
 */
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.getIdToken();
};

/**
 * Create a subscription with the payment method
 * @param {string} paymentMethodId - Stripe PaymentMethod ID from Elements
 * @param {string} email - User's email for invoice
 * @param {string} name - User's name (optional)
 * @param {Object} address - Billing address (optional) { country, postal_code, city, line1 }
 */
export const createSubscription = async (paymentMethodId, email, name, address) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${FUNCTIONS_BASE_URL}/createSubscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentMethodId,
        email,
        name,
        address,
      }),
    });

    const text = await response.text();

    if (!text) {
      throw new Error('Empty response from payment server');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      logger.error('[Stripe] JSON parse error:', parseError);
      throw new Error('Invalid response from payment server');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create subscription');
    }

    const stripe = await stripePromise;

    // Trial with pending setup intent — save card for when trial converts to paid
    if (data.setupClientSecret) {
      const { error } = await stripe.confirmCardSetup(data.setupClientSecret, {
        payment_method: paymentMethodId,
      });
      if (error) {
        logger.error('[Stripe] Card setup error:', error);
        throw new Error(error.message);
      }
      return { status: 'trial', trialEnd: data.trialEnd, subscriptionId: data.subscriptionId };
    }

    // Trial without setup intent (card already attached to customer)
    if (data.status === 'trial') {
      return { status: 'trial', trialEnd: data.trialEnd, subscriptionId: data.subscriptionId };
    }

    // Normal payment — ALWAYS confirm explicitly so:
    // 1. The first invoice is actually charged
    // 2. The card is authorized for future off-session renewals
    if (data.clientSecret) {
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: paymentMethodId,
      });

      if (error) {
        logger.error('[Stripe] Payment confirmation error:', error);
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
        return { status: 'success', subscriptionId: data.subscriptionId };
      }

      throw new Error(`Payment failed: ${paymentIntent.status}`);
    }

    // Fallback for edge cases (e.g., status: 'success' with no clientSecret)
    return { status: data.status || 'success', subscriptionId: data.subscriptionId };
  } catch (error) {
    logger.error('[Stripe] Error creating subscription:', error);
    throw error;
  }
};

/**
 * Cancel the user's subscription
 */
export const cancelSubscription = async () => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${FUNCTIONS_BASE_URL}/cancelSubscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to cancel subscription');
    }

    return data;
  } catch (error) {
    logger.error('Error cancelling subscription:', error);
    throw error;
  }
};

/**
 * Open Stripe Billing Portal for the current user
 */
export const openBillingPortal = async () => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${FUNCTIONS_BASE_URL}/createBillingPortalSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to open billing portal');
    }

    window.open(data.url, '_blank');
    return data;
  } catch (error) {
    logger.error('Error opening billing portal:', error);
    throw error;
  }
};

/**
 * Get recent invoices for the current user
 */
export const getInvoices = async () => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${FUNCTIONS_BASE_URL}/getInvoices`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch invoices');
    }

    return data.invoices || [];
  } catch (error) {
    logger.error('Error fetching invoices:', error);
    return [];
  }
};

const stripeService = {
  getStripe,
  createSubscription,
  cancelSubscription,
  openBillingPortal,
  getInvoices,
};

export default stripeService;
