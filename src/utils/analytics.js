// src/utils/analytics.js
// Thin wrapper around window.gtag (GA4 already loaded via index.html).
// All functions are no-ops when gtag is not available (e.g. dev without internet).

const gtag = (...args) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
};

/**
 * Track a SPA page view. Call on every route change.
 * @param {string} path - e.g. '/dashboard'
 * @param {string} title - document.title at the time of navigation
 */
export const trackPageView = (path, title) => {
  gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  });
};

/**
 * Track when a free user clicks the Premium upgrade button.
 */
export const trackPremiumUpgradeClick = () => {
  gtag('event', 'premium_upgrade_click', {
    event_category: 'engagement',
  });
};

/**
 * Track a successful premium purchase (GA4 ecommerce).
 * @param {string} planType - 'subscription' | 'trial'
 */
export const trackPurchase = (planType) => {
  gtag('event', 'purchase', {
    currency: 'AUD',
    value: planType === 'trial' ? 0 : 2.99,
    transaction_id: `orary_${Date.now()}`,
    items: [{
      item_id: 'orary_premium',
      item_name: 'Orary Premium',
      price: planType === 'trial' ? 0 : 2.99,
      quantity: 1,
    }],
  });
};

/**
 * Track when a free trial starts.
 */
export const trackTrialStart = () => {
  gtag('event', 'trial_start', {
    event_category: 'conversion',
  });
};
