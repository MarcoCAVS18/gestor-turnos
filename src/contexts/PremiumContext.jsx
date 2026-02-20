// src/contexts/PremiumContext.jsx
// Context for managing premium subscriptions and Live Mode limits

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  loadSubscriptionAndUsage,
  upgradeToPremium as upgradeToPremiumService,
  cancelSubscription as cancelSubscriptionService,
  canUseLiveMode,
  incrementLiveModeUsage,
  LIVE_MODE_FREE_LIMIT,
} from '../services/premiumService';
import logger from '../utils/logger';

// Create context
const PremiumContext = createContext();

// Custom hook to use context
export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

// Premium colors for UI consistency
export const PREMIUM_COLORS = {
  primary: '#D4A000',      // Dark gold
  light: '#F5C518',        // Premium yellow
  lighter: '#FFF3CD',      // Soft background
  gold: '#FFD700',         // Icon gold
  text: '#1a1a1a',         // Dark text for contrast
  gradient: 'linear-gradient(135deg, #FFF3CD 0%, #F5C518 50%, #D4A000 100%)',
};

// Context provider
export const PremiumProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // State
  const [subscription, setSubscription] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveModeUsage, setLiveModeUsage] = useState({
    monthlyCount: 0,
    remaining: LIVE_MODE_FREE_LIMIT,
  });

  // Modal state (for premium upsell modal)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Load subscription data when user changes
  useEffect(() => {
    const loadSubscriptionData = async () => {
      if (!currentUser?.uid) {
        setSubscription(null);
        setIsPremium(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Single read: load subscription + live mode usage together
        const { subscription: subscriptionData, liveModeUsage: usageData } =
          await loadSubscriptionAndUsage(currentUser.uid);

        setSubscription(subscriptionData);
        setIsPremium(subscriptionData?.isPremium && subscriptionData?.status === 'active');

        setLiveModeUsage({
          monthlyCount: usageData.monthlyCount || 0,
          remaining: Math.max(0, LIVE_MODE_FREE_LIMIT - (usageData.monthlyCount || 0)),
        });

      } catch (err) {
        logger.error('Error loading subscription data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionData();
  }, [currentUser?.uid]);

  // Upgrade to premium
  const upgradeToPremium = useCallback(async (paymentData) => {
    if (!currentUser?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      const newSubscription = await upgradeToPremiumService(currentUser.uid, paymentData);
      setSubscription(newSubscription);
      setIsPremium(true);
      return newSubscription;
    } catch (err) {
      logger.error('Error upgrading to premium:', err);
      setError(err.message);
      throw err;
    }
  }, [currentUser?.uid]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    if (!currentUser?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      const cancelledSubscription = await cancelSubscriptionService(currentUser.uid);
      setSubscription(cancelledSubscription);
      setIsPremium(false);
      return cancelledSubscription;
    } catch (err) {
      logger.error('Error cancelling subscription:', err);
      setError(err.message);
      throw err;
    }
  }, [currentUser?.uid]);

  // Check if user can use Live Mode
  const checkLiveModeLimit = useCallback(async () => {
    if (!currentUser?.uid) {
      return { canUse: false, remaining: 0, isPremium: false };
    }

    try {
      const result = await canUseLiveMode(currentUser.uid);

      // Update local state
      if (!result.isPremium) {
        setLiveModeUsage({
          monthlyCount: result.monthlyCount || 0,
          remaining: result.remaining,
        });
      }

      return result;
    } catch (err) {
      logger.error('Error checking Live Mode limit:', err);
      return { canUse: true, remaining: LIVE_MODE_FREE_LIMIT, isPremium: false };
    }
  }, [currentUser?.uid]);

  // Record Live Mode usage (call this when a session starts)
  const recordLiveModeUsage = useCallback(async () => {
    if (!currentUser?.uid || isPremium) {
      return;
    }

    try {
      const updatedUsage = await incrementLiveModeUsage(currentUser.uid);
      setLiveModeUsage({
        monthlyCount: updatedUsage.monthlyCount,
        remaining: Math.max(0, LIVE_MODE_FREE_LIMIT - updatedUsage.monthlyCount),
      });
    } catch (err) {
      logger.error('Error recording Live Mode usage:', err);
    }
  }, [currentUser?.uid, isPremium]);

  // Open premium modal
  const openPremiumModal = useCallback(() => {
    setIsPremiumModalOpen(true);
  }, []);

  // Close premium modal
  const closePremiumModal = useCallback(() => {
    setIsPremiumModalOpen(false);
  }, []);

  const value = {
    // Subscription state
    subscription,
    isPremium,
    loading,
    error,

    // Live Mode usage
    liveModeUsage,
    liveModeLimit: LIVE_MODE_FREE_LIMIT,

    // Actions
    upgradeToPremium,
    cancelSubscription,
    checkLiveModeLimit,
    recordLiveModeUsage,

    // Modal state
    isPremiumModalOpen,
    openPremiumModal,
    closePremiumModal,

    // Colors for UI
    premiumColors: PREMIUM_COLORS,
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
};

export default PremiumProvider;
