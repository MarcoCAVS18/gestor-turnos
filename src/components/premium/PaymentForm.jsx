// src/components/premium/PaymentForm.jsx

import React, { useState, useEffect } from 'react';
import { MapPin, Shield, Receipt } from 'lucide-react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../../contexts/AuthContext';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import { createSubscription, isStripeTestMode } from '../../services/stripeService';
import { AUD_PRICE } from '../../services/currencyService';
import Button from '../ui/Button';
import { CARD_NUMBER_OPTIONS, CARD_EXPIRY_OPTIONS, CARD_CVC_OPTIONS, COUNTRIES } from './constants';
import logger from '../../utils/logger';

const PaymentForm = ({ onSuccess, onProcessingStart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    country: 'AU',
    postalCode: '',
    city: '',
    address: '',
  });

  // Pre-fill name from user profile
  useEffect(() => {
    if (currentUser?.displayName) {
      setBillingDetails(prev => ({ ...prev, name: currentUser.displayName }));
    }
  }, [currentUser?.displayName]);

  const handleBillingChange = (field) => (e) => {
    setBillingDetails(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system not ready. Please refresh and try again.');
      return;
    }

    setLoading(true);
    setError(null);
    onProcessingStart?.();

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error('Card input not found. Please refresh and try again.');
      }

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          email: currentUser?.email,
          name: billingDetails.name || currentUser?.displayName,
          address: {
            country: billingDetails.country,
            postal_code: billingDetails.postalCode,
            city: billingDetails.city || undefined,
            line1: billingDetails.address || undefined,
          },
        },
      });

      if (pmError) {
        logger.error('[Premium] Payment method error:', pmError);
        throw new Error(pmError.message);
      }

      const result = await createSubscription(
        paymentMethod.id,
        currentUser?.email,
        billingDetails.name || currentUser?.displayName,
        {
          country: billingDetails.country,
          postal_code: billingDetails.postalCode,
          city: billingDetails.city || undefined,
          line1: billingDetails.address || undefined,
        }
      );

      if (!result) {
        throw new Error('No response from payment server. Please try again.');
      }

      const successStatuses = ['success', 'active', 'succeeded', 'processing', 'trial'];
      if (successStatuses.includes(result.status)) {
        onSuccess(result);
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        logger.error('[Premium] Unexpected result status:', result.status, result);
        throw new Error(`Payment processing failed (${result.status || 'unknown'}). Please try again.`);
      }
    } catch (err) {
      logger.error('[Premium] Payment error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="on">
      {/* Test Mode Banner */}
      {isStripeTestMode && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-orange-700 text-sm font-semibold">STRIPE TEST MODE</p>
          <p className="text-orange-600 text-xs mt-1">
            Use card <code className="bg-orange-100 px-1 rounded">4242 4242 4242 4242</code> with any future date and CVC.
          </p>
        </div>
      )}

      {/* Billing Details Section */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Billing Details</span>
        </div>

        {/* Cardholder Name */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Cardholder Name
          </label>
          <input
            type="text"
            value={billingDetails.name}
            onChange={handleBillingChange('name')}
            placeholder="Full name on card"
            required
            autoComplete="cc-name"
            className="w-full p-3 border rounded-xl text-sm transition-colors focus:outline-none focus:border-gray-400"
            style={{ borderColor: '#e5e7eb' }}
          />
        </div>

        {/* Country + Postal Code Row */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Country
            </label>
            <select
              value={billingDetails.country}
              onChange={handleBillingChange('country')}
              required
              autoComplete="billing country"
              className="w-full p-3 border rounded-xl text-sm transition-colors focus:outline-none focus:border-gray-400 bg-white"
              style={{ borderColor: '#e5e7eb' }}
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Postal Code
            </label>
            <input
              type="text"
              value={billingDetails.postalCode}
              onChange={handleBillingChange('postalCode')}
              placeholder="e.g. 2000"
              required
              autoComplete="billing postal-code"
              className="w-full p-3 border rounded-xl text-sm transition-colors focus:outline-none focus:border-gray-400"
              style={{ borderColor: '#e5e7eb' }}
            />
          </div>
        </div>

        {/* City + Address Row (optional) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              City <span className="text-gray-300">(optional)</span>
            </label>
            <input
              type="text"
              value={billingDetails.city}
              onChange={handleBillingChange('city')}
              placeholder="City"
              autoComplete="billing address-level2"
              className="w-full p-3 border rounded-xl text-sm transition-colors focus:outline-none focus:border-gray-400"
              style={{ borderColor: '#e5e7eb' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Address <span className="text-gray-300">(optional)</span>
            </label>
            <input
              type="text"
              value={billingDetails.address}
              onChange={handleBillingChange('address')}
              placeholder="Street address"
              autoComplete="billing street-address"
              className="w-full p-3 border rounded-xl text-sm transition-colors focus:outline-none focus:border-gray-400"
              style={{ borderColor: '#e5e7eb' }}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-5" />

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

      {/* Trial Notice */}
      <div
        className="flex items-start gap-3 p-3 rounded-lg mb-4"
        style={{ backgroundColor: `${PREMIUM_COLORS.lighter}50` }}
      >
        <Receipt size={18} style={{ color: PREMIUM_COLORS.primary }} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600">
          Your card won't be charged for 15 days. After your trial, ${AUD_PRICE} AUD/month is billed to <strong>{currentUser?.email}</strong>. Cancel anytime.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="premium"
        className="w-full"
        size="lg"
        loading={loading}
        loadingText="Setting up trial..."
        disabled={!stripe || loading}
      >
        Start 15-Day Free Trial
      </Button>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-3">
        <Shield size={14} />
        <span>Secure payment powered by Stripe</span>
      </div>
    </form>
  );
};

export default PaymentForm;
