// functions/stripeUtils.js
// Reads Stripe objects in a way that works with both API shapes.
//
// stripe-node 20 talks API 2026-01-28 ("clover"). Since 2025-03-31 ("basil")
// several fields this code depends on moved:
//   Subscription.current_period_end -> subscription.items.data[].current_period_end
//   Invoice.subscription            -> invoice.parent.subscription_details.subscription
//   Invoice.paid                    -> invoice.status === 'paid'
//   Invoice.payment_intent          -> invoice.confirmation_secret (client secret)
// Webhook payloads use the API version configured on the endpoint in the Stripe
// dashboard, which can be older than the library's, so every reader accepts both.

const idOf = (value) => (typeof value === 'string' ? value : value?.id || null);

/** Period end (unix seconds) of a subscription, or null. */
const getPeriodEnd = (subscription) => {
  if (!subscription) return null;
  if (typeof subscription.current_period_end === 'number') return subscription.current_period_end;
  const ends = (subscription.items?.data || [])
    .map((item) => item?.current_period_end)
    .filter((n) => typeof n === 'number');
  return ends.length ? Math.max(...ends) : null;
};

const FALLBACK_PERIOD_MS = 30 * 24 * 60 * 60 * 1000;

/** Expiry to store for a subscription, in ms. Falls back to 30 days only if Stripe gives nothing. */
const getExpiryMillis = (subscription, now = Date.now()) => {
  const end = getPeriodEnd(subscription);
  return end ? end * 1000 : now + FALLBACK_PERIOD_MS;
};

/** Subscription id an invoice belongs to, or null for one-off invoices. */
const getInvoiceSubscriptionId = (invoice) => {
  if (!invoice) return null;
  const direct = idOf(invoice.subscription) || idOf(invoice.parent?.subscription_details?.subscription);
  if (direct) return direct;
  const line = (invoice.lines?.data || []).find((l) => l?.parent?.subscription_item_details?.subscription);
  return idOf(line?.parent?.subscription_item_details?.subscription);
};

const isInvoicePaid = (invoice) => invoice?.paid === true || invoice?.status === 'paid';

/** Client secret the browser needs to confirm (and 3-D Secure) the invoice payment. */
const getInvoiceClientSecret = (invoice) =>
  invoice?.confirmation_secret?.client_secret ||
  (invoice?.payment_intent && typeof invoice.payment_intent === 'object' ? invoice.payment_intent.client_secret : null) ||
  null;

/** Cancelled at period end, from the app (cancel_at_period_end) or the billing portal (cancel_at). */
const isCancelling = (subscription) => !!(subscription?.cancel_at_period_end || subscription?.cancel_at);

/**
 * Firestore field updates (dot-notation under `subscription.`) that mirror a
 * Stripe subscription's state, or null when the state needs no change
 * (e.g. 'incomplete', still waiting for the first payment).
 * @param {object} subscription - Stripe subscription
 * @param {(ms: number) => any} toTimestamp - converts ms to a Firestore Timestamp
 */
const subscriptionStateUpdates = (subscription, toTimestamp) => {
  if (!subscription) return null;
  const base = {
    'subscription.stripeSubscriptionId': subscription.id,
    'subscription.stripeCustomerId': idOf(subscription.customer),
    'subscription.expiryDate': toTimestamp(getExpiryMillis(subscription)),
  };
  const cancelling = isCancelling(subscription);
  switch (subscription.status) {
    case 'trialing':
      return {
        ...base,
        'subscription.isPremium': true,
        'subscription.plan': 'premium',
        'subscription.status': cancelling ? 'cancelling' : 'trialing',
        ...(subscription.trial_end ? { 'subscription.trialEnd': toTimestamp(subscription.trial_end * 1000) } : {}),
      };
    case 'active':
      return {
        ...base,
        'subscription.isPremium': true,
        'subscription.plan': 'premium',
        'subscription.status': cancelling ? 'cancelling' : 'active',
        'subscription.trialEnd': null,
        'subscription.trialEndingSoon': null,
      };
    case 'past_due':
    case 'unpaid':
      return { ...base, 'subscription.status': 'past_due' };
    case 'canceled':
    case 'incomplete_expired':
      return { ...base, 'subscription.isPremium': false, 'subscription.plan': 'free', 'subscription.status': 'cancelled' };
    default:
      return null;
  }
};

module.exports = {
  idOf,
  getPeriodEnd,
  getExpiryMillis,
  getInvoiceSubscriptionId,
  isInvoicePaid,
  getInvoiceClientSecret,
  isCancelling,
  subscriptionStateUpdates,
};
