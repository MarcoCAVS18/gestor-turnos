// src/services/premiumService.js
// Service for managing premium subscriptions and Live Mode usage

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import logger from '../utils/logger';

// Default subscription structure
const DEFAULT_SUBSCRIPTION = {
  isPremium: false,
  plan: 'free', // 'free' | 'premium'
  status: 'inactive', // 'active' | 'inactive' | 'cancelled'
  startDate: null,
  expiryDate: null,
  paymentMethod: null,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
};

// Default Live Mode usage structure
const DEFAULT_LIVE_MODE_USAGE = {
  monthlyCount: 0,
  lastResetDate: null,
};

// Monthly limit for free users
export const LIVE_MODE_FREE_LIMIT = 5;

/**
 * Get user's subscription data
 */
export const getSubscription = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();

      return data.subscription || DEFAULT_SUBSCRIPTION;
    }

    return DEFAULT_SUBSCRIPTION;
  } catch (error) {
    logger.error('Error getting subscription:', error);
    throw error;
  }
};

/**
 * Initialize subscription fields for a user (if not exists)
 */
export const initializeSubscription = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();

      // Only initialize if subscription doesn't exist
      if (!data.subscription) {
        await updateDoc(userDocRef, {
          subscription: DEFAULT_SUBSCRIPTION,
          liveModeUsage: {
            ...DEFAULT_LIVE_MODE_USAGE,
            lastResetDate: new Date(),
          },
        });
      }
    }
  } catch (error) {
    logger.error('Error initializing subscription:', error);
    throw error;
  }
};

/**
 * Load subscription + live mode usage in a single Firestore read
 * Combines initializeSubscription + getSubscription + getLiveModeUsage into 1 read
 */
export const loadSubscriptionAndUsage = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return {
        subscription: DEFAULT_SUBSCRIPTION,
        liveModeUsage: DEFAULT_LIVE_MODE_USAGE,
      };
    }

    const data = userDoc.data();

    // Initialize subscription if missing (single write, no extra read)
    if (!data.subscription) {
      const initData = {
        subscription: DEFAULT_SUBSCRIPTION,
        liveModeUsage: {
          ...DEFAULT_LIVE_MODE_USAGE,
          lastResetDate: new Date(),
        },
      };
      await updateDoc(userDocRef, initData);
      return {
        subscription: DEFAULT_SUBSCRIPTION,
        liveModeUsage: initData.liveModeUsage,
      };
    }

    // Check live mode usage reset
    let liveModeUsage = data.liveModeUsage || DEFAULT_LIVE_MODE_USAGE;
    if (liveModeUsage.lastResetDate) {
      const lastReset = liveModeUsage.lastResetDate.toDate
        ? liveModeUsage.lastResetDate.toDate()
        : new Date(liveModeUsage.lastResetDate);
      const now = new Date();
      if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        liveModeUsage = { monthlyCount: 0, lastResetDate: now };
        await updateDoc(userDocRef, { liveModeUsage });
      }
    }

    return {
      subscription: data.subscription || DEFAULT_SUBSCRIPTION,
      liveModeUsage,
    };
  } catch (error) {
    logger.error('Error loading subscription and usage:', error);
    throw error;
  }
};

/**
 * Update subscription to premium
 */
export const upgradeToPremium = async (userId, paymentData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const now = new Date();

    // Calculate expiry date (1 month from now)
    const expiryDate = new Date(now);
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const subscription = {
      isPremium: true,
      plan: 'premium',
      status: 'active',
      startDate: now,
      expiryDate: expiryDate,
      paymentMethod: paymentData?.last4 || null,
      stripeCustomerId: paymentData?.customerId || null,
      stripeSubscriptionId: paymentData?.subscriptionId || null,
    };

    await updateDoc(userDocRef, { subscription });

    return subscription;
  } catch (error) {
    logger.error('Error upgrading to premium:', error);
    throw error;
  }
};

/**
 * Cancel premium subscription
 */
export const cancelSubscription = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);

    const subscription = {
      ...DEFAULT_SUBSCRIPTION,
      status: 'cancelled',
    };

    await updateDoc(userDocRef, { subscription });

    // TODO: Call Stripe API to cancel the subscription
    // await stripe.subscriptions.del(stripeSubscriptionId);

    return subscription;
  } catch (error) {
    logger.error('Error cancelling subscription:', error);
    throw error;
  }
};

/**
 * Check if premium subscription is still valid
 */
export const checkSubscriptionValidity = async (userId) => {
  try {
    const subscription = await getSubscription(userId);

    if (!subscription.isPremium || subscription.status !== 'active') {
      return false;
    }

    // Check expiry date
    if (subscription.expiryDate) {
      const expiryDate = subscription.expiryDate.toDate
        ? subscription.expiryDate.toDate()
        : new Date(subscription.expiryDate);

      if (expiryDate < new Date()) {
        // Subscription expired, update status
        await cancelSubscription(userId);
        return false;
      }
    }

    return true;
  } catch (error) {
    logger.error('Error checking subscription validity:', error);
    return false;
  }
};

/**
 * Get Live Mode usage for the current month
 */
export const getLiveModeUsage = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      const usage = data.liveModeUsage || DEFAULT_LIVE_MODE_USAGE;

      // Check if we need to reset the monthly count
      if (usage.lastResetDate) {
        const lastReset = usage.lastResetDate.toDate
          ? usage.lastResetDate.toDate()
          : new Date(usage.lastResetDate);

        const now = new Date();

        // Reset if it's a new month
        if (
          lastReset.getMonth() !== now.getMonth() ||
          lastReset.getFullYear() !== now.getFullYear()
        ) {
          const resetUsage = {
            monthlyCount: 0,
            lastResetDate: now,
          };

          await updateDoc(userDocRef, { liveModeUsage: resetUsage });
          return resetUsage;
        }
      }

      return usage;
    }

    return DEFAULT_LIVE_MODE_USAGE;
  } catch (error) {
    logger.error('Error getting Live Mode usage:', error);
    throw error;
  }
};

/**
 * Increment Live Mode usage count
 */
export const incrementLiveModeUsage = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const usage = await getLiveModeUsage(userId);

    const updatedUsage = {
      monthlyCount: (usage.monthlyCount || 0) + 1,
      lastResetDate: usage.lastResetDate || new Date(),
    };

    await updateDoc(userDocRef, { liveModeUsage: updatedUsage });

    return updatedUsage;
  } catch (error) {
    logger.error('Error incrementing Live Mode usage:', error);
    throw error;
  }
};

/**
 * Check if user can use Live Mode (based on premium status and usage limit)
 * Optimized: single Firestore read instead of 2 separate reads
 */
export const canUseLiveMode = async (userId) => {
  try {
    // Single read for both subscription and usage
    const { subscription, liveModeUsage } = await loadSubscriptionAndUsage(userId);

    // Check premium validity
    const isValid = subscription.isPremium && subscription.status === 'active' &&
      (!subscription.expiryDate || (() => {
        const exp = subscription.expiryDate?.toDate
          ? subscription.expiryDate.toDate()
          : new Date(subscription.expiryDate);
        return exp >= new Date();
      })());

    if (isValid) {
      return { canUse: true, remaining: Infinity, isPremium: true };
    }

    // For free users, check usage limit
    const remaining = LIVE_MODE_FREE_LIMIT - (liveModeUsage.monthlyCount || 0);

    return {
      canUse: remaining > 0,
      remaining: Math.max(0, remaining),
      isPremium: false,
      monthlyCount: liveModeUsage.monthlyCount || 0,
    };
  } catch (error) {
    logger.error('Error checking Live Mode availability:', error);
    return { canUse: true, remaining: LIVE_MODE_FREE_LIMIT, isPremium: false };
  }
};

const premiumService = {
  getSubscription,
  initializeSubscription,
  loadSubscriptionAndUsage,
  upgradeToPremium,
  cancelSubscription,
  checkSubscriptionValidity,
  getLiveModeUsage,
  incrementLiveModeUsage,
  canUseLiveMode,
  LIVE_MODE_FREE_LIMIT,
};

export default premiumService;
