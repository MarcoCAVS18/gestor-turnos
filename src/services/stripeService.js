// src/services/stripeService.js
// Frontend service for Stripe payment integration

import { loadStripe } from '@stripe/stripe-js';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
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

    // Payment already confirmed in backend (immediate success for non-trial)
    if (data.status === 'success') {
      return { status: 'success', subscriptionId: data.subscriptionId };
    }

    // Non-trial: immediate payment via Stripe.js (handles direct + 3DS natively)
    // Also handles legacy 'requires_action' from older backend responses
    if ((data.status === 'requires_payment' || data.status === 'requires_action') && data.clientSecret) {
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: paymentMethodId,
      });

      if (error) {
        logger.error('[Stripe] Payment confirmation error:', error);
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
        // Verify with server and activate subscription in Firestore
        await verifyAndActivateSubscription(data.subscriptionId);
        return { status: 'success', subscriptionId: data.subscriptionId };
      }

      throw new Error(`Payment failed: ${paymentIntent.status}`);
    }

    // Fallback for edge cases
    return { status: data.status || 'success', subscriptionId: data.subscriptionId };
  } catch (error) {
    logger.error('[Stripe] Error creating subscription:', error);
    throw error;
  }
};

/**
 * Verify and activate a subscription after Stripe.js confirmCardPayment succeeds.
 * @param {string} subscriptionId - Stripe Subscription ID
 */
const verifyAndActivateSubscription = async (subscriptionId) => {
  const token = await getAuthToken();

  const response = await fetch(`${FUNCTIONS_BASE_URL}/verifyAndActivateSubscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ subscriptionId }),
  });

  const data = await response.json();

  if (!response.ok) {
    logger.error('[Stripe] Subscription activation error:', data);
    throw new Error(data.error || 'Failed to activate subscription');
  }

  return data;
};

/**
 * Activate an existing Stripe subscription into Firestore.
 * Used when payment succeeded in Stripe but Firestore was never updated.
 */
export const activateExistingSubscription = async () => {
  const token = await getAuthToken();

  const response = await fetch(`${FUNCTIONS_BASE_URL}/activateExistingSubscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'No active subscription found');
  }

  return data;
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
    
    logger.info('[Stripe] Opening billing portal...', { url: `${FUNCTIONS_BASE_URL}/createBillingPortalSession` });

    const response = await fetch(`${FUNCTIONS_BASE_URL}/createBillingPortalSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({}), // Empty body required for some CORS configurations
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      logger.error('[Stripe] Failed to parse billing portal response:', parseError);
      throw new Error('Invalid response from billing portal');
    }

    if (!response.ok) {
      logger.error('[Stripe] Billing portal error response:', { status: response.status, data });
      throw new Error(data.error || `Failed to open billing portal (${response.status})`);
    }

    if (!data.url) {
      throw new Error('No portal URL returned from server');
    }

    // On Capacitor native, use Browser.open() (SFSafariViewController/Chrome Custom Tabs)
    // which supports OAuth flows. window.open('_system') is a Cordova convention — it does NOT work in Capacitor.
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url: data.url });
    } else {
      const newWindow = window.open(data.url, '_blank');
      // Check if popup was blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        logger.warn('[Stripe] Popup may have been blocked, falling back to same window');
        window.location.href = data.url;
      }
    }
    return data;
  } catch (error) {
    logger.error('[Stripe] Error opening billing portal:', error);
    // Provide more specific error messages
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to billing portal. Please check your connection and try again.');
    }
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
