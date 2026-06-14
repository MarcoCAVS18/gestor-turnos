// src/services/premiumService.js
// Service for managing premium subscriptions and Live Mode usage

import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
 * NOTE: lastResetDate must be serverTimestamp() — Firestore rules reject any
 * liveModeUsage write whose lastResetDate is not the server time.
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
            monthlyCount: 0,
            lastResetDate: serverTimestamp(),
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
    const trialDocRef = doc(db, 'trial_records', userId);
    const [userDoc, trialDoc] = await Promise.all([getDoc(userDocRef), getDoc(trialDocRef)]);
    const hasUsedTrial = trialDoc.exists();

    if (!userDoc.exists()) {
      return {
        subscription: DEFAULT_SUBSCRIPTION,
        liveModeUsage: DEFAULT_LIVE_MODE_USAGE,
        hasUsedTrial,
      };
    }

    const data = userDoc.data();

    // Initialize subscription if missing (single write, no extra read)
    if (!data.subscription) {
      await updateDoc(userDocRef, {
        subscription: DEFAULT_SUBSCRIPTION,
        liveModeUsage: {
          monthlyCount: 0,
          lastResetDate: serverTimestamp(),
        },
      });
      return {
        subscription: DEFAULT_SUBSCRIPTION,
        liveModeUsage: { monthlyCount: 0, lastResetDate: new Date() },
        hasUsedTrial,
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
        await updateDoc(userDocRef, {
          liveModeUsage: { monthlyCount: 0, lastResetDate: serverTimestamp() },
        });
        liveModeUsage = { monthlyCount: 0, lastResetDate: now };
      }
    }

    return {
      subscription: data.subscription || DEFAULT_SUBSCRIPTION,
      liveModeUsage,
      hasUsedTrial,
    };
  } catch (error) {
    logger.error('Error loading subscription and usage:', error);
    throw error;
  }
};

// NOTE: subscription upgrades/cancellations are handled exclusively by Cloud
// Functions (see stripeService.js) — Firestore rules block client-side writes
// that set subscription.isPremium to true.

// Statuses that allow premium access (user keeps access until their period ends)
const PREMIUM_VALID_STATUSES = ['active', 'cancelling', 'trialing'];

/**
 * Pure check: is this subscription object currently valid premium?
 * Validates status AND expiry/trial dates — used by PremiumContext and
 * canUseLiveMode so an expired subscription never grants access just because
 * a webhook was missed.
 */
export const isSubscriptionValid = (subscription) => {
  if (!subscription?.isPremium || !PREMIUM_VALID_STATUSES.includes(subscription.status)) {
    return false;
  }

  const now = new Date();

  // For trialing: check trialEnd date
  if (subscription.status === 'trialing') {
    if (!subscription.trialEnd) return true;
    const trialEnd = subscription.trialEnd.toDate
      ? subscription.trialEnd.toDate()
      : new Date(subscription.trialEnd);
    return trialEnd >= now;
  }

  // For active/cancelling: check expiryDate
  if (!subscription.expiryDate) return true;
  const expiryDate = subscription.expiryDate.toDate
    ? subscription.expiryDate.toDate()
    : new Date(subscription.expiryDate);
  return expiryDate >= now;
};

/**
 * Check if premium subscription is still valid (fetches from Firestore)
 */
export const checkSubscriptionValidity = async (userId) => {
  try {
    const subscription = await getSubscription(userId);
    return isSubscriptionValid(subscription);
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
          await updateDoc(userDocRef, {
            liveModeUsage: { monthlyCount: 0, lastResetDate: serverTimestamp() },
          });
          return { monthlyCount: 0, lastResetDate: now };
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
    const newCount = (usage.monthlyCount || 0) + 1;

    // Firestore rules only allow +1 increments with a server timestamp
    await updateDoc(userDocRef, {
      liveModeUsage: { monthlyCount: newCount, lastResetDate: serverTimestamp() },
    });

    return { monthlyCount: newCount, lastResetDate: new Date() };
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

    // Check premium validity: active, cancelling (access until period end), or trialing
    if (isSubscriptionValid(subscription)) {
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
  isSubscriptionValid,
  checkSubscriptionValidity,
  getLiveModeUsage,
  incrementLiveModeUsage,
  canUseLiveMode,
  LIVE_MODE_FREE_LIMIT,
};

export default premiumService;
