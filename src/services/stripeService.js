// src/services/stripeService.js
// Frontend service for Stripe payment integration

import { loadStripe } from '@stripe/stripe-js';
import { auth } from './firebase';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Cloud Functions base URL
// Always use production URL since functions are deployed
// To use local emulator, set REACT_APP_USE_EMULATOR=true and run: firebase emulators:start --only functions
const FUNCTIONS_BASE_URL = process.env.REACT_APP_USE_EMULATOR === 'true'
  ? 'http://localhost:5001/gestionturnos-7ec99/us-central1'
  : 'https://us-central1-gestionturnos-7ec99.cloudfunctions.net';

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
 */
export const createSubscription = async (paymentMethodId, email, name) => {
  try {
    const token = await getAuthToken();

    console.log('[Stripe] Creating subscription...');

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
      }),
    });

    // Check if response has content
    const text = await response.text();
    console.log('[Stripe] Raw response:', text);

    if (!text) {
      throw new Error('Empty response from payment server');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('[Stripe] JSON parse error:', parseError);
      throw new Error('Invalid response from payment server');
    }

    console.log('[Stripe] Parsed response:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create subscription');
    }

    // If payment requires 3D Secure authentication
    if (data.status === 'requires_action') {
      console.log('[Stripe] 3D Secure required, confirming payment...');
      const stripe = await stripePromise;
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret);

      if (error) {
        console.error('[Stripe] 3D Secure error:', error);
        throw new Error(error.message);
      }

      console.log('[Stripe] 3D Secure completed, status:', paymentIntent?.status);

      // Payment confirmed - handle various success states
      if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
        return {
          status: 'success',
          subscriptionId: data.subscriptionId,
          message: 'Subscription created successfully!',
        };
      }

      // If still requires action or other status, return with appropriate status
      return {
        status: paymentIntent.status === 'succeeded' ? 'success' : paymentIntent.status,
        subscriptionId: data.subscriptionId,
      };
    }

    // Ensure we always return something with a status
    if (!data.status) {
      console.warn('[Stripe] Response missing status field:', data);
      // If subscription was created, treat as success
      if (data.subscriptionId) {
        return { ...data, status: 'success' };
      }
    }

    return data;
  } catch (error) {
    console.error('[Stripe] Error creating subscription:', error);
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
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

const stripeService = {
  getStripe,
  createSubscription,
  cancelSubscription,
};

export default stripeService;
