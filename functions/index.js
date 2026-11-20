// functions/index.js

// v1 (1st gen) API. Since firebase-functions v6 the package root exports the
// 2nd gen API, so the 1st gen triggers used here must come from the /v1 entry.
const functions = require('firebase-functions/v1');
// Modular Admin SDK imports (the legacy `admin.*` namespace is removed in v14).
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, Timestamp, FieldValue, FieldPath } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const emailService = require('./emailService');
const {
  idOf,
  getExpiryMillis,
  getInvoiceSubscriptionId,
  isInvoicePaid,
  getInvoiceClientSecret,
  subscriptionStateUpdates,
} = require('./stripeUtils');
const { isValidTimeZone, generateICS } = require('./calendarUtils');
const allowedOrigins = [
  'https://gestionturnos-7ec99.web.app',
  'https://gestionturnos-7ec99.firebaseapp.com',
  'https://orary.app',
  'http://localhost:3000',
  'http://localhost:3001',
  // Capacitor native app origins
  'capacitor://localhost', // iOS
  'https://localhost',     // Android Capacitor 5+
  'http://localhost',      // Android Capacitor older / fallback
];
const cors = require('cors')({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});
require('dotenv').config();

// Initialize Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const crypto = require('crypto');

initializeApp();
const db = getFirestore();

// ============================================
// SECURITY HELPERS - Rate Limiting & Validation
// ============================================

/**
 * Rate limiter using Firestore
 * Tracks request counts per user per function with sliding window
 * @param {string} userId - User ID
 * @param {string} functionName - Cloud Function name
 * @param {number} maxRequests - Max requests allowed in window
 * @param {number} windowMs - Time window in milliseconds (default: 60s)
 * @returns {boolean} true if request is allowed
 */
// Firestore TTL deletes these server-only docs on their own (TTL policies on
// `expireAt` in firestore.indexes.json). Deletion can lag up to ~24 h.
const expireIn = (ms) => Timestamp.fromMillis(Date.now() + ms);
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

async function checkRateLimit(userId, functionName, maxRequests = 10, windowMs = 60000) {
  const key = `${userId}_${functionName}`;
  const ref = db.collection('rate_limits').doc(key);

  const result = await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    const now = Date.now();

    if (!doc.exists) {
      transaction.set(ref, { count: 1, windowStart: now, expireAt: expireIn(windowMs + ONE_DAY_MS) });
      return true;
    }

    const data = doc.data();
    const elapsed = now - data.windowStart;

    if (elapsed > windowMs) {
      // Window expired, reset
      transaction.update(ref, { count: 1, windowStart: now, expireAt: expireIn(windowMs + ONE_DAY_MS) });
      return true;
    }

    if (data.count >= maxRequests) {
      return false; // Rate limit exceeded
    }

    transaction.update(ref, { count: data.count + 1 });
    return true;
  });

  return result;
}

/**
 * Validate that a Stripe customer belongs to the authenticated user
 * @param {string} customerId - Stripe customer ID
 * @param {string} userId - Firebase user ID
 * @returns {boolean} true if customer belongs to user
 */
async function validateCustomerOwnership(customerId, userId) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer.metadata?.firebaseUserId === userId;
  } catch {
    return false;
  }
}

// Validated redirect URL
const getAppUrl = () => {
  const url = process.env.APP_URL || 'https://orary.app';
  const allowed = ['https://orary.app', 'https://gestionturnos-7ec99.web.app', 'https://gestionturnos-7ec99.firebaseapp.com', 'http://localhost:3000'];
  return allowed.includes(url) ? url : 'https://orary.app';
};

// ============================================
// STRIPE HELPERS
// ============================================
// The Google Calendar OAuth sync that lived here (getGoogleAuthUrl,
// googleAuthCallback, disconnect/status, syncAllShiftsToCalendar and the three
// shift triggers) was removed on 2026-11-18: its UI was taken out on 2026-03-02
// and no user had it connected. The ICS feed below (getCalendarToken /
// userCalendar) is the calendar integration in use.

const toTimestamp = (ms) => Timestamp.fromMillis(ms);

/**
 * Finds the Firestore user for a Stripe object. Looks up the stored customer id
 * first, then falls back to the firebaseUserId metadata set on every customer
 * and subscription this code creates, so a payment Firestore has not recorded
 * yet (browser closed mid-checkout) still reaches the right user.
 * @returns {Promise<FirebaseFirestore.DocumentSnapshot|null>}
 */
async function findUserForStripe({ customerId = null, subscription = null, subscriptionId = null }) {
  if (customerId) {
    const snap = await db.collection('users').where('subscription.stripeCustomerId', '==', customerId).limit(1).get();
    if (!snap.empty) return snap.docs[0];
  }
  let uid = subscription?.metadata?.firebaseUserId || null;
  if (!uid && subscriptionId) {
    try { uid = (await stripe.subscriptions.retrieve(subscriptionId)).metadata?.firebaseUserId || null; } catch { /* not found */ }
  }
  if (!uid && customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted) uid = customer.metadata?.firebaseUserId || null;
    } catch { /* not found */ }
  }
  if (!uid) return null;
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? doc : null;
}

/**
 * Active (or trialing, or paid-but-still-incomplete) subscription for a Firebase
 * user across all of their Stripe customers. Email lookup is only used when the
 * caller passes an email, i.e. when Firebase has verified it: otherwise anyone
 * could register with someone else's address and claim their subscription.
 */
async function findActiveStripeSubscription({ userId, email = null, priceId = null, extraCustomerIds = [] }) {
  const [byMetadata, byEmail] = await Promise.all([
    stripe.customers.search({ query: `metadata['firebaseUserId']:'${userId}'`, limit: 10 }),
    email ? stripe.customers.list({ email, limit: 10 }) : Promise.resolve({ data: [] }),
  ]);
  const customerIds = [...new Set([...extraCustomerIds, ...byMetadata.data.map((c) => c.id), ...byEmail.data.map((c) => c.id)].filter(Boolean))];

  for (const customerId of customerIds) {
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 20,
      ...(priceId ? { price: priceId } : {}),
      expand: ['data.latest_invoice'],
    });
    let found = subs.data.find((s) => s.status === 'active' || s.status === 'trialing');
    // Stripe moves incomplete -> active asynchronously after the invoice is paid
    if (!found) found = subs.data.find((s) => s.status === 'incomplete' && isInvoicePaid(s.latest_invoice));
    if (found) return { customerId, subscription: found };
  }
  return null;
}

/** "**** 4242" for a payment method id, or null. */
async function describePaymentMethod(paymentMethodId) {
  if (!paymentMethodId) return null;
  try {
    const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
    return pm.card?.last4 ? `**** ${pm.card.last4}` : null;
  } catch {
    return null;
  }
}

/** Marks a user as premium from an active or trialing Stripe subscription. */
async function activateUserSubscription(userId, { customerId = null, subscription, paymentMethodId = null, now = Timestamp.now() }) {
  const state = subscriptionStateUpdates(
    // incomplete-but-paid subscriptions are treated as active
    subscription.status === 'incomplete' ? { ...subscription, status: 'active' } : subscription,
    toTimestamp
  );
  if (!state || state['subscription.isPremium'] !== true) {
    throw new Error(`Subscription ${subscription.id} is not active (${subscription.status})`);
  }
  const updates = {
    ...state,
    'subscription.stripeCustomerId': customerId || idOf(subscription.customer),
    'subscription.startDate': now,
  };
  const label = await describePaymentMethod(paymentMethodId || idOf(subscription.default_payment_method));
  if (label) updates['subscription.paymentMethod'] = label;
  await db.collection('users').doc(userId).update(updates);
}

// ============================================
// STRIPE FUNCTIONS - Premium Subscriptions
// ============================================

/**
 * Create a Stripe Customer and Subscription
 * Called when user submits payment form
 */
exports.createSubscription = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Verify Firebase Auth token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      // Rate limiting: max 5 subscription attempts per minute
      const allowed = await checkRateLimit(userId, 'createSubscription', 5, 60000);
      if (!allowed) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }

      const { paymentMethodId, name, address } = req.body;

      // Use verified email from Firebase Auth token instead of client-provided email
      const email = decodedToken.email;

      if (!paymentMethodId || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Build address object for Stripe (only include non-empty fields)
      const billingAddress = {};
      if (address) {
        if (address.country) billingAddress.country = address.country;
        if (address.postal_code) billingAddress.postal_code = address.postal_code;
        if (address.city) billingAddress.city = address.city;
        if (address.line1) billingAddress.line1 = address.line1;
      }

      // Race condition protection: acquire lock atomically inside a transaction
      // so two concurrent requests can never both pass the age check.
      const lockRef = db.collection('subscription_locks').doc(userId);
      const lockAcquired = await db.runTransaction(async (transaction) => {
        const lockDoc = await transaction.get(lockRef);
        if (lockDoc.exists) {
          const lockAge = Date.now() - (lockDoc.data().createdAt?.toMillis() || 0);
          // If lock is less than 30 seconds old, reject (concurrent request)
          if (lockAge < 30000) return false;
        }
        transaction.set(lockRef, { createdAt: FieldValue.serverTimestamp(), userId, expireAt: expireIn(ONE_DAY_MS) });
        return true;
      });
      if (!lockAcquired) {
        return res.status(409).json({ error: 'Subscription creation already in progress' });
      }

      try {
      // Check if user already has a Stripe customer ID
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data() || {};
      let customerId = userData.subscription?.stripeCustomerId;

      // Validate customer ownership if customerId exists
      if (customerId) {
        const isOwner = await validateCustomerOwnership(customerId, userId);
        if (!isOwner) {
          customerId = null; // Force creation of new customer
        }
      }

      // Create or retrieve Stripe customer
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: email,
          name: name || undefined,
          payment_method: paymentMethodId,
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
          address: Object.keys(billingAddress).length > 0 ? billingAddress : undefined,
          metadata: {
            firebaseUserId: userId,
          },
        });
        customerId = customer.id;
      } else {
        // Attach new payment method to existing customer
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        });
        const updateData = {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        };
        if (Object.keys(billingAddress).length > 0) {
          updateData.address = billingAddress;
        }
        await stripe.customers.update(customerId, updateData);
      }

      // Check if STRIPE_PRICE_ID is configured
      const priceId = process.env.STRIPE_PRICE_ID;
      if (!priceId || priceId === 'price_XXXXX') {
        console.error('STRIPE_PRICE_ID is not configured!');
        return res.status(500).json({
          error: 'Payment system not configured. Please contact support.',
        });
      }

      const now = Timestamp.now();

      // Already subscribed (e.g. payment succeeded in Stripe but Firestore was
      // never updated): activate that one instead of creating a duplicate.
      const existing = await findActiveStripeSubscription({
        userId,
        email: decodedToken.email_verified ? email : null,
        priceId,
        extraCustomerIds: [customerId],
      });
      if (existing) {
        console.log('Existing subscription found:', existing.subscription.id, existing.subscription.status);
        await activateUserSubscription(userId, { customerId: existing.customerId, subscription: existing.subscription, paymentMethodId, now });
        return res.json({ status: 'success', subscriptionId: existing.subscription.id });
      }

      // Free trial only once per user (record survives "Clear Everything")
      const trialRecord = await db.collection('trial_records').doc(userId).get();
      const trialAlreadyUsed = trialRecord.exists;

      // trial_end: 'now' overrides any trial defined on the price itself, forcing
      // an immediate billable invoice for returning users.
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        ...(trialAlreadyUsed ? { trial_end: 'now' } : { trial_period_days: 15 }),
        payment_behavior: 'default_incomplete',
        collection_method: 'charge_automatically',
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        // confirmation_secret is the API 2025-03-31+ replacement of
        // latest_invoice.payment_intent (removed from the Invoice object).
        expand: ['latest_invoice.confirmation_secret', 'pending_setup_intent'],
        metadata: { firebaseUserId: userId },
      });

      // ---- Trial: no payment yet, the card is saved for when it converts
      if (subscription.status === 'trialing') {
        const trialEndMillis = subscription.trial_end ? subscription.trial_end * 1000 : Date.now() + (15 * 24 * 60 * 60 * 1000);

        await db.collection('trial_records').doc(userId).set({
          usedAt: FieldValue.serverTimestamp(),
          stripeSubscriptionId: subscription.id,
        });

        await db.collection('users').doc(userId).update({
          subscription: {
            isPremium: true,
            plan: 'premium',
            status: 'trialing',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            startDate: now,
            trialEnd: Timestamp.fromMillis(trialEndMillis),
            expiryDate: Timestamp.fromMillis(getExpiryMillis(subscription)),
            paymentMethod: (await describePaymentMethod(paymentMethodId)) || null,
          },
        });

        return res.json({
          status: 'trial',
          trialEnd: subscription.trial_end,
          setupClientSecret: subscription.pending_setup_intent?.client_secret || null,
          subscriptionId: subscription.id,
        });
      }

      // ---- No trial: payment required now
      if (subscription.status === 'active') {
        await activateUserSubscription(userId, { customerId, subscription, paymentMethodId, now });
        return res.json({ status: 'success', subscriptionId: subscription.id });
      }

      let invoice = subscription.latest_invoice && typeof subscription.latest_invoice === 'object'
        ? subscription.latest_invoice
        : null;
      if (!invoice && subscription.latest_invoice) {
        invoice = await stripe.invoices.retrieve(subscription.latest_invoice, { expand: ['confirmation_secret'] });
      }
      if (!invoice) throw new Error('No invoice found for subscription');

      // Nothing to pay (credit balance, 100% coupon) or already paid
      if (invoice.amount_due === 0 || isInvoicePaid(invoice)) {
        const fresh = await stripe.subscriptions.retrieve(subscription.id);
        if (fresh.status === 'active') {
          await activateUserSubscription(userId, { customerId, subscription: fresh, paymentMethodId, now });
          return res.json({ status: 'success', subscriptionId: fresh.id });
        }
      }

      if (invoice.status === 'draft') {
        invoice = await stripe.invoices.finalizeInvoice(invoice.id, { expand: ['confirmation_secret'] });
      }

      // The browser confirms the payment with Stripe.js, which also runs 3-D
      // Secure when the bank asks for it. (Charging server-side with
      // invoices.pay() cannot complete 3-D Secure.)
      const clientSecret = getInvoiceClientSecret(invoice);
      if (!clientSecret) {
        console.error('No client secret for invoice', invoice.id, 'status', invoice.status);
        throw new Error('Could not initialize payment. Please try again.');
      }

      // Remember the pending subscription now, so the webhook can activate this
      // user even if the browser never returns to verifyAndActivateSubscription.
      await db.collection('users').doc(userId).set({
        subscription: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          ...(userData.subscription?.isPremium === true ? {} : { isPremium: false, status: 'incomplete' }),
        },
      }, { merge: true });

      return res.json({
        status: 'requires_payment',
        clientSecret,
        subscriptionId: subscription.id,
      });
      } finally {
        // Release lock
        await lockRef.delete();
      }
    } catch (error) {
      // Ensure lock is released on error
      try { await db.collection('subscription_locks').doc(userId).delete(); } catch {}
      console.error('Error creating subscription:', error);
      res.status(500).json({
        error: error.message || 'Failed to create subscription',
      });
    }
  });
});

/**
 * Activate an existing Stripe subscription into Firestore.
 * Safe to call multiple times — only updates if Stripe confirms the subscription is active.
 * Used when payment succeeded in Stripe but Firestore was never updated.
 */
exports.activateExistingSubscription = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const userId = decodedToken.uid;
      const email = decodedToken.email;

      const found = await findActiveStripeSubscription({
        userId,
        email: decodedToken.email_verified ? email : null,
      });
      if (!found) {
        return res.status(404).json({ error: 'No active subscription found in Stripe.' });
      }

      await activateUserSubscription(userId, { customerId: found.customerId, subscription: found.subscription });
      console.log(`activateExistingSubscription: activated ${found.subscription.id} for user ${userId}`);
      return res.json({ status: 'success', subscriptionId: found.subscription.id, customerId: found.customerId });
    } catch (error) {
      console.error('Error activating subscription:', error);
      res.status(500).json({ error: error.message || 'Failed to activate subscription' });
    }
  });
});

/**
 * Cancel a subscription
 */
exports.cancelSubscription = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      // Rate limiting: max 5 cancel attempts per minute
      const cancelAllowed = await checkRateLimit(userId, 'cancelSubscription', 5, 60000);
      if (!cancelAllowed) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }

      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const subscriptionId = userData?.subscription?.stripeSubscriptionId;
      const customerId = userData?.subscription?.stripeCustomerId;

      if (!subscriptionId) {
        return res.status(400).json({ error: 'No active subscription found' });
      }

      // Validate customer ownership
      if (customerId) {
        const isOwner = await validateCustomerOwnership(customerId, userId);
        if (!isOwner) {
          return res.status(403).json({ error: 'Customer verification failed' });
        }
      }

      // Try to cancel the subscription in Stripe
      try {
        // First, check the subscription status in Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // If already canceled, just update Firestore
        if (stripeSubscription.status === 'canceled') {
          await db.collection('users').doc(userId).update({
            'subscription.status': 'cancelled',
            'subscription.isPremium': false,
          });
          return res.json({
            status: 'success',
            message: 'Subscription was already cancelled',
          });
        }
        
        // If already set to cancel at period end, just confirm
        if (stripeSubscription.cancel_at_period_end) {
          await db.collection('users').doc(userId).update({
            'subscription.status': 'cancelling',
          });
          return res.json({
            status: 'success',
            message: 'Subscription will be cancelled at the end of the billing period',
          });
        }

        // Cancel at period end (user keeps access until paid period ends)
        await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
      } catch (stripeError) {
        // Handle cases where subscription is already gone or already canceled
        const alreadyCanceled =
          stripeError.code === 'resource_missing' ||
          (stripeError.message && stripeError.message.toLowerCase().includes('canceled subscription'));

        if (alreadyCanceled) {
          await db.collection('users').doc(userId).update({
            'subscription.status': 'cancelled',
            'subscription.isPremium': false,
            'subscription.stripeSubscriptionId': null,
          });
          return res.json({
            status: 'success',
            message: 'Subscription was already cancelled',
          });
        }

        // Log and re-throw other Stripe errors
        console.error('Stripe error cancelling subscription:', stripeError);
        throw new Error(`Stripe error: ${stripeError.message}`);
      }

      // Update Firestore
      await db.collection('users').doc(userId).update({
        'subscription.status': 'cancelling',
      });

      res.json({
        status: 'success',
        message: 'Subscription will be cancelled at the end of the billing period',
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to cancel subscription',
        code: error.code || 'UNKNOWN_ERROR'
      });
    }
  });
});

/**
 * Verify and activate a subscription after Stripe.js confirmCardPayment succeeds.
 * Called by the frontend once stripe.confirmCardPayment() resolves with status='succeeded'.
 * Retrieves the subscription from Stripe to confirm it's active, then updates Firestore.
 */
exports.verifyAndActivateSubscription = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const { subscriptionId } = req.body;
      if (!subscriptionId) {
        return res.status(400).json({ error: 'Missing subscriptionId' });
      }

      // Retrieve subscription from Stripe to get authoritative status
      let subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Security: ensure this subscription belongs to the requesting user
      if (subscription.metadata?.firebaseUserId !== userId) {
        return res.status(403).json({ error: 'Subscription does not belong to this user' });
      }

      // Stripe flips the subscription from 'incomplete' to 'active' a moment after
      // the payment succeeds; give it a few seconds before reporting a failure.
      for (let attempt = 0; attempt < 4 && !['active', 'trialing'].includes(subscription.status); attempt++) {
        await new Promise((r) => setTimeout(r, 1500));
        subscription = await stripe.subscriptions.retrieve(subscriptionId);
      }

      if (!['active', 'trialing'].includes(subscription.status)) {
        return res.status(400).json({
          error: `Subscription payment not yet confirmed (status: ${subscription.status})`,
        });
      }

      await activateUserSubscription(userId, { customerId: idOf(subscription.customer), subscription });
      return res.json({ status: 'success', subscriptionId: subscription.id });
    } catch (error) {
      console.error('Error verifying subscription:', error);
      return res.status(500).json({ error: error.message || 'Failed to verify subscription' });
    }
  });
});

/**
 * Create Stripe Billing Portal session
 * Allows users to manage payment methods, view invoices, etc.
 */
exports.createBillingPortalSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      // Rate limiting: max 10 portal requests per minute
      const portalAllowed = await checkRateLimit(userId, 'billingPortal', 10, 60000);
      if (!portalAllowed) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }

      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const customerId = userData?.subscription?.stripeCustomerId;

      if (!customerId) {
        return res.status(400).json({ error: 'No Stripe customer found' });
      }

      // Validate customer ownership - verify the customer belongs to this user
      const isOwner = await validateCustomerOwnership(customerId, userId);
      if (!isOwner) {
        console.error('Customer ownership validation failed:', customerId, userId);
        return res.status(403).json({
          error: 'Customer verification failed. Please contact support.',
          code: 'CUSTOMER_MISMATCH'
        });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${getAppUrl()}/premium`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating billing portal session:', error.message);
      res.status(500).json({
        error: 'Failed to create billing portal session',
      });
    }
  });
});

/**
 * adminSetPremiumStatus
 * Lets an admin (custom claim `admin: true`) manually grant or revoke Premium
 * access for a user, entirely outside Stripe — for support/goodwill upgrades.
 * Only touches subscription.isPremium/plan/status/manualGrant/grantedBy —
 * stripeCustomerId/stripeSubscriptionId are never written, so Stripe webhooks
 * (which look users up by those two fields) can never find or overwrite a
 * manually-granted account. Refuses to touch any user who already has a real
 * Stripe subscription, so it can't be used to clobber Stripe-managed state.
 */
const RECENT_LOGIN_WINDOW_SECONDS = 30 * 60; // 30 minutes

exports.adminSetPremiumStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.admin !== true) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required.');
  }

  // Defense in depth: even if the client-side re-auth gate were bypassed,
  // the ID token itself must be backed by a sign-in from the last 30 minutes
  // (auth_time is set by Firebase Auth at login/reauthentication and cannot
  // be forged by the client) before this sensitive action is allowed.
  const authAgeSeconds = Date.now() / 1000 - context.auth.token.auth_time;
  if (authAgeSeconds > RECENT_LOGIN_WINDOW_SECONDS) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Recent authentication required. Please sign in again before performing this action.'
    );
  }

  const adminUid = context.auth.uid;
  const { targetUserId, grant } = data || {};

  if (!targetUserId || typeof targetUserId !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'targetUserId is required.');
  }
  if (typeof grant !== 'boolean') {
    throw new functions.https.HttpsError('invalid-argument', 'grant must be a boolean.');
  }

  const allowed = await checkRateLimit(adminUid, 'adminSetPremiumStatus', 20, 60000);
  if (!allowed) {
    throw new functions.https.HttpsError('resource-exhausted', 'Too many requests. Please slow down.');
  }

  const userRef = db.collection('users').doc(targetUserId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'User not found.');
  }

  const existingSubscription = userDoc.data().subscription || {};
  if (existingSubscription.stripeSubscriptionId) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'This user has a Stripe-managed subscription. Use the billing/cancellation flow instead of a manual grant.'
    );
  }

  const now = Timestamp.now();

  if (grant) {
    await userRef.update({
      'subscription.isPremium': true,
      'subscription.plan': 'premium',
      'subscription.status': 'active',
      'subscription.startDate': now,
      'subscription.expiryDate': null,
      'subscription.manualGrant': true,
      'subscription.grantedBy': adminUid,
      'subscription.grantedAt': now,
    });
  } else {
    await userRef.update({
      'subscription.isPremium': false,
      'subscription.plan': 'free',
      'subscription.status': 'cancelled',
      'subscription.manualGrant': false,
      'subscription.revokedBy': adminUid,
      'subscription.revokedAt': now,
    });
  }

  console.log(`adminSetPremiumStatus: admin ${adminUid} (${context.auth.token.email || 'unknown'}) set grant=${grant} for user ${targetUserId}`);
  return { success: true, targetUserId, grant };
});

/**
 * Get recent invoices for the current user
 * Returns the last 5 invoices from Stripe
 */
exports.getInvoices = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      // Rate limiting: 10 requests per minute
      const allowed = await checkRateLimit(userId, 'getInvoices', 10, 60000);
      if (!allowed) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }

      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const customerId = userData?.subscription?.stripeCustomerId;

      if (!customerId) {
        return res.json({ invoices: [] });
      }

      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit: 5,
        status: 'paid',
      });

      const formattedInvoices = invoices.data.map(inv => ({
        id: inv.id,
        number: inv.number,
        amount: inv.amount_paid / 100,
        currency: (inv.currency || 'aud').toUpperCase(),
        date: inv.created * 1000,
        pdfUrl: inv.invoice_pdf,
        hostedUrl: inv.hosted_invoice_url,
      }));

      res.json({ invoices: formattedInvoices });
    } catch (error) {
      console.error('Error fetching invoices:', error.message);
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  });
});

/**
 * Stripe Webhook - Handle subscription events
 * Set this URL in Stripe Dashboard: Webhooks > Add endpoint
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!endpointSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return res.status(500).send('Webhook not configured');
    }
    if (!sig) {
      console.error('Missing stripe-signature header');
      return res.status(400).send('Missing signature');
    }
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed');
    return res.status(400).send('Webhook signature verification failed');
  }

  // Idempotency check — skip already-processed events
  const eventRef = db.collection('processed_webhooks').doc(event.id);
  const existingEvent = await eventRef.get();
  if (existingEvent.exists) {
    console.log(`Webhook event ${event.id} already processed, skipping`);
    return res.json({ received: true, duplicate: true });
  }

  // Handle the event. Errors return 500 so Stripe retries the delivery; the
  // event is only marked processed after it was handled.
  try {
    switch (event.type) {
      case 'invoice.paid': {
        const invoice = event.data.object;
        const subscriptionId = getInvoiceSubscriptionId(invoice);
        if (!subscriptionId) break; // one-off invoice, not a subscription

        // Trial start generates a $0 invoice; marking 'active' here would wipe
        // the user's 'trialing' status and trial end date.
        if (invoice.billing_reason === 'subscription_create' && invoice.amount_paid === 0) {
          console.log(`Skipping $0 subscription_create invoice ${invoice.id} (trial start)`);
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userDoc = await findUserForStripe({ customerId: idOf(invoice.customer), subscription });
        if (!userDoc) {
          console.warn(`invoice.paid: no user for customer ${idOf(invoice.customer)} / subscription ${subscriptionId}`);
          break;
        }

        const state = subscriptionStateUpdates(subscription, toTimestamp) || {};
        await userDoc.ref.update({
          ...state,
          'subscription.isPremium': true,
          'subscription.plan': 'premium',
          'subscription.status': state['subscription.status'] && state['subscription.status'] !== 'past_due' ? state['subscription.status'] : 'active',
          'subscription.stripeCustomerId': idOf(invoice.customer),
          'subscription.stripeSubscriptionId': subscription.id,
          'subscription.expiryDate': toTimestamp(getExpiryMillis(subscription)),
        });
        console.log(`Invoice paid for user ${userDoc.id}`);

        // Payment confirmation email (fire-and-forget)
        const userData = userDoc.data() || {};
        const userEmail = userData.email || (await getAuth().getUser(userDoc.id).catch(() => null))?.email;
        if (userEmail) {
          const periodEndMs = getExpiryMillis(subscription);
          const nextBillingDate = new Date(periodEndMs).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          const currency = (invoice.currency || 'aud').toUpperCase();
          const formattedAmount = invoice.amount_paid
            ? `${(invoice.amount_paid / 100).toFixed(2)} ${currency} / month`
            : 'Premium';
          emailService.sendSubscriptionConfirmationEmail({
            email: userEmail,
            displayName: userData.displayName || userData.name || '',
            amount: formattedAmount,
            nextBillingDate,
            invoiceUrl: invoice.hosted_invoice_url || null,
          }).catch((err) => console.warn('Failed to send subscription confirmation email:', err.message));
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const userDoc = await findUserForStripe({ customerId: idOf(invoice.customer), subscriptionId: getInvoiceSubscriptionId(invoice) });
        if (userDoc) {
          await userDoc.ref.update({ 'subscription.status': 'past_due' });
          console.log(`Payment failed for user ${userDoc.id}`);
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        // Covers trial -> active, cancel or reactivate from the app or the Stripe
        // billing portal, past_due, and the final cancellation.
        const subscription = event.data.object;
        const userDoc = await findUserForStripe({ customerId: idOf(subscription.customer), subscription });
        if (!userDoc) break;
        const updates = subscriptionStateUpdates(
          event.type === 'customer.subscription.deleted' ? { ...subscription, status: 'canceled' } : subscription,
          toTimestamp
        );
        if (updates) {
          await userDoc.ref.update(updates);
          console.log(`${event.type} -> ${updates['subscription.status']} for user ${userDoc.id}`);
        }
        break;
      }

      case 'customer.subscription.trial_will_end': {
        // Fired 3 days before the trial ends; the UI shows a notice
        const subscription = event.data.object;
        const userDoc = await findUserForStripe({ customerId: idOf(subscription.customer), subscription });
        if (userDoc) await userDoc.ref.update({ 'subscription.trialEndingSoon': true });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`stripeWebhook ${event.type} (${event.id}) failed:`, err.message);
    return res.status(500).send('Webhook handler failed');
  }

  // Mark event as processed for idempotency
  await eventRef.set({
    type: event.type,
    processedAt: FieldValue.serverTimestamp(),
    // Stripe retries a delivery for up to 3 days; 30 days of dedup is plenty
    expireAt: expireIn(30 * ONE_DAY_MS),
  });

  res.json({ received: true });
});

// ============================================
// CALENDAR FEED - WebCal ICS Subscription
// ============================================

/**
 * Get or create a permanent calendar subscription token for the authenticated user.
 * Returns the webcal feed URL. The token never changes so existing subscriptions
 * continue to work after the user re-opens the app.
 */
exports.getCalendarToken = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

    const idToken = authHeader.split('Bearer ')[1];
    let uid;
    try {
      const decoded = await getAuth().verifyIdToken(idToken);
      uid = decoded.uid;
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Timezone from the device; written into the ICS, so only valid IANA names
    const requested = req.body?.timezone;
    const timezone = isValidTimeZone(requested) ? requested : 'UTC';

    // Get or generate a permanent calendar token for this user
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    let calendarToken = userDoc.data()?.calendarToken;

    const updates = { calendarTimezone: timezone };
    if (!calendarToken) {
      calendarToken = crypto.randomBytes(32).toString('hex');
      updates.calendarToken = calendarToken;
    }
    await userRef.set(updates, { merge: true });

    const feedUrl = `https://orary.app/cal?uid=${uid}&token=${calendarToken}`;
    res.json({ url: feedUrl });
  });
});

/**
 * Public ICS feed — called directly by calendar apps (no auth header).
 * Secured with a per-user secret token stored in Firestore.
 * Returns an ICS file with the user's shifts (last 90 days + next 365 days).
 */
exports.userCalendar = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'GET') return res.status(405).send('Method not allowed');

  const { uid, token } = req.query;
  // Cheap format checks before touching Firestore: Firebase uids are
  // alphanumeric and tokens are 32 random bytes in hex.
  if (typeof uid !== 'string' || !/^[A-Za-z0-9]{1,128}$/.test(uid)
      || typeof token !== 'string' || !/^[0-9a-f]{64}$/.test(token)) {
    return res.status(400).send('Missing or invalid uid or token');
  }

  // Light rate limit per uid — calendar apps poll every few hours, so 20/min
  // is generous for legitimate use but slows down token brute-forcing.
  const feedAllowed = await checkRateLimit(uid, 'userCalendar', 20, 60000);
  if (!feedAllowed) return res.status(429).send('Too many requests');

  // Validate token with a constant-time comparison over digests
  const userDoc = await db.collection('users').doc(uid).get();
  const storedToken = userDoc.exists ? userDoc.data().calendarToken : null;
  const tokensMatch = typeof storedToken === 'string' && crypto.timingSafeEqual(
    crypto.createHash('sha256').update(token).digest(),
    crypto.createHash('sha256').update(storedToken).digest()
  );
  if (!tokensMatch) {
    return res.status(403).send('Forbidden');
  }

  const storedTz = userDoc.data().calendarTimezone;
  const timezone = isValidTimeZone(storedTz) ? storedTz : 'UTC';

  // Date range for JS-side filtering: last 90 days → next 365 days
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(pastDate.getDate() - 90);
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + 365);
  const pastDateStr = pastDate.toISOString().split('T')[0];
  const futureDateStr = futureDate.toISOString().split('T')[0];

  try {
    // Query only by userId — no composite index required.
    // Date filtering is done in JS to avoid Firestore index requirements.
    const [shiftsSnapshot, worksSnapshot] = await Promise.all([
      db.collection('shifts').where('userId', '==', uid).get(),
      db.collection('works').where('userId', '==', uid).get(),
    ]);

    const worksMap = {};
    worksSnapshot.forEach(doc => { worksMap[doc.id] = doc.data(); });

    const shifts = [];
    shiftsSnapshot.forEach(doc => {
      const data = doc.data();
      // Filter by date range in JS
      if (data.startDate >= pastDateStr && data.startDate <= futureDateStr) {
        shifts.push({ id: doc.id, ...data });
      }
    });

    const ics = generateICS(shifts, worksMap, timezone);

    res.set('Content-Type', 'text/calendar; charset=utf-8');
    res.set('Content-Disposition', 'inline; filename="orary-shifts.ics"');
    res.set('Cache-Control', 'no-cache, no-store');
    res.send(ics);
  } catch (error) {
    console.error('userCalendar error:', error);
    res.status(500).send('Internal server error');
  }
});

// ============================================
// CLEANUP - Expired Share Documents
// ============================================

/**
 * Deletes shared_works documents past their 48h expiration (expiresAt field).
 * Shared by the HTTP endpoint below and the scheduled function so there is a
 * single implementation of the cleanup logic.
 * @returns {Promise<number>} total documents deleted
 */
async function cleanupExpiredShares() {
  const now = Timestamp.now();
  const expiredQuery = db.collection('shared_works')
    .where('expiresAt', '<', now)
    .limit(500);

  let totalDeleted = 0;
  let snapshot = await expiredQuery.get();

  while (!snapshot.empty) {
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    totalDeleted += snapshot.size;

    if (snapshot.size < 500) break;
    snapshot = await expiredQuery.get();
  }

  return totalDeleted;
}

/**
 * HTTP-triggered cleanup function for expired shared_works documents.
 * Kept for manual/external invocation (e.g. one-off runs while debugging).
 * The recurring cleanup is now handled automatically by
 * `scheduledCleanExpiredShares` below — this endpoint is no longer required
 * for normal operation.
 *
 * Secured with CRON_SECRET env variable — call from external cron service
 * or Cloud Scheduler with header: Authorization: Bearer <CRON_SECRET>
 *
 * Example: curl -H "Authorization: Bearer YOUR_SECRET" https://...cloudfunctions.net/cleanExpiredShares
 */
exports.cleanExpiredShares = functions.https.onRequest(async (req, res) => {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;

  if (!cronSecret || !authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const totalDeleted = await cleanupExpiredShares();
    console.log(`Cleanup: deleted ${totalDeleted} expired shared works`);
    res.json({ success: true, deleted: totalDeleted });
  } catch (error) {
    console.error('Cleanup error:', error.message);
    res.status(500).json({ error: 'Cleanup failed' });
  }
});

/**
 * Scheduled cleanup — runs automatically every 24 hours so expired shares
 * don't accumulate indefinitely. First scheduled (pubsub) function in this
 * project; requires the Blaze plan (already in use for outbound network
 * calls elsewhere) and the Cloud Scheduler API enabled on first deploy.
 */
exports.scheduledCleanExpiredShares = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    try {
      const totalDeleted = await cleanupExpiredShares();
      console.log(`Scheduled cleanup: deleted ${totalDeleted} expired shared works`);
    } catch (error) {
      console.error('Scheduled cleanup error:', error.message);
    }
    return null;
  });


// ============================================
// ACCOUNT DELETION - server-side cleanup
// ============================================

/**
 * Runs when a Firebase Auth user is deleted (from the app's Delete Account flow
 * or the console). The client already deletes shifts, works, payslips and the
 * user document, but it cannot reach server-only data (private subcollection,
 * rate limits, trial record), other users' shared links, sessions or Storage.
 * Everything tied to the uid is removed here, idempotently.
 */
exports.cleanupDeletedUser = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  const deleted = {};

  const deleteQuery = async (label, q) => {
    let total = 0;
    for (;;) {
      const snap = await q.limit(400).get();
      if (snap.empty) break;
      const batch = db.batch();
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      total += snap.size;
      if (snap.size < 400) break;
    }
    deleted[label] = total;
  };

  // Stop renewals for any live subscription (keeps the already-paid period)
  try {
    const customers = await stripe.customers.search({ query: `metadata['firebaseUserId']:'${uid}'`, limit: 10 });
    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({ customer: customer.id, status: 'all', limit: 20 });
      for (const sub of subs.data) {
        if (['active', 'trialing', 'past_due'].includes(sub.status) && !sub.cancel_at_period_end) {
          await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
          deleted.stripeRenewalsStopped = (deleted.stripeRenewalsStopped || 0) + 1;
        }
      }
    }
  } catch (err) {
    console.warn('cleanupDeletedUser: Stripe step failed:', err.message);
  }

  const steps = [
    () => db.recursiveDelete(db.collection('users').doc(uid)), // includes private/
    () => deleteQuery('shifts', db.collection('shifts').where('userId', '==', uid)),
    () => deleteQuery('works', db.collection('works').where('userId', '==', uid)),
    () => deleteQuery('payslips', db.collection('payslips').where('userId', '==', uid)),
    () => deleteQuery('liveSessions', db.collection('liveSessions').where('userId', '==', uid)),
    () => deleteQuery('sharedWorks', db.collection('shared_works').where('sharedBy', '==', uid)),
    () => deleteQuery('rateLimits', db.collection('rate_limits')
      .where(FieldPath.documentId(), '>=', `${uid}_`)
      .where(FieldPath.documentId(), '<', `${uid}_\uf8ff`)),
    () => db.collection('feedback').doc(uid).delete(),
    () => db.collection('trial_records').doc(uid).delete(),
    () => db.collection('subscription_locks').doc(uid).delete(),
    () => getStorage().bucket().deleteFiles({ prefix: `profile-photos/${uid}/` }),
  ];
  for (const step of steps) {
    try { await step(); } catch (err) { console.warn('cleanupDeletedUser step failed:', err.message); }
  }

  console.log(`cleanupDeletedUser ${uid}: ${JSON.stringify(deleted)}`);
  return null;
});

// ============================================
// CUSTOM AUTH EMAILS — powered by Resend
// ============================================
// Firebase blocks editing certain email templates (spam prevention).
// These callable functions generate the official Firebase action links
// via Admin SDK and send branded HTML emails through Resend instead.

const APP_URL = process.env.APP_URL || 'https://orary.app';

/**
 * sendVerificationEmail
 * Called after user registration. Generates a Firebase email-verification
 * link and delivers it using the branded HTML template.
 */
exports.sendVerificationEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.');
  }

  const uid = context.auth.uid;

  const allowed = await checkRateLimit(uid, 'sendVerificationEmail', 3, 300000); // 3 per 5 min
  if (!allowed) {
    throw new functions.https.HttpsError('resource-exhausted', 'Too many requests. Please wait a few minutes.');
  }

  try {
    const user = await getAuth().getUser(uid);
    if (user.emailVerified) {
      return { success: true, alreadyVerified: true };
    }

    const link = await getAuth().generateEmailVerificationLink(user.email, {
      url: `${APP_URL}/dashboard`,
    });

    await emailService.sendVerificationEmail({
      email: user.email,
      displayName: user.displayName || '',
      link,
    });

    return { success: true };
  } catch (err) {
    console.error('sendVerificationEmail error:', err);
    throw new functions.https.HttpsError('internal', 'Failed to send verification email.');
  }
});

/**
 * sendPasswordResetEmailCustom
 * Replaces Firebase's built-in password reset email with the branded template.
 * Can be called without authentication (user forgot their password).
 */
exports.sendPasswordResetEmailCustom = functions.https.onCall(async (data) => {
  const email = (data.email || '').trim().toLowerCase();
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required.');
  }

  // Rate-limit by email hash to prevent enumeration attacks
  const crypto = require('crypto');
  const emailHash = crypto.createHash('sha256').update(email).digest('hex').slice(0, 16);
  const allowed = await checkRateLimit(emailHash, 'passwordReset', 3, 300000); // 3 per 5 min
  if (!allowed) {
    throw new functions.https.HttpsError('resource-exhausted', 'Too many requests. Please wait a few minutes.');
  }

  try {
    const link = await getAuth().generatePasswordResetLink(email, {
      url: `${APP_URL}/login`,
    });

    await emailService.sendPasswordResetEmail({ email, link });

    return { success: true };
  } catch (err) {
    // Don't reveal whether the email exists — always return success
    console.error('sendPasswordResetEmailCustom error:', err.code, err.message);
    return { success: true };
  }
});

/**
 * sendEmailChangeNotification
 * Notifies the OLD email address when it is changed.
 * Should be called right before calling updateEmail() on the client.
 */
exports.sendEmailChangeNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.');
  }

  const uid = context.auth.uid;
  const newEmail = (data.newEmail || '').trim().toLowerCase();
  if (!newEmail) {
    throw new functions.https.HttpsError('invalid-argument', 'newEmail is required.');
  }

  const allowed = await checkRateLimit(uid, 'emailChange', 2, 600000); // 2 per 10 min
  if (!allowed) {
    throw new functions.https.HttpsError('resource-exhausted', 'Too many requests.');
  }

  try {
    const user = await getAuth().getUser(uid);
    const oldEmail = user.email;

    // Generate a "revert" link pointing back to the old email (sign-in page)
    const link = `${APP_URL}/login`;

    await emailService.sendEmailChangeNotification({
      oldEmail,
      newEmail,
      displayName: user.displayName || '',
      link,
    });

    return { success: true };
  } catch (err) {
    console.error('sendEmailChangeNotification error:', err);
    throw new functions.https.HttpsError('internal', 'Failed to send email change notification.');
  }
});

/**
 * sendMFAEnrollmentNotification
 * Confirms MFA enrollment to the user's email.
 */
exports.sendMFAEnrollmentNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.');
  }

  const uid = context.auth.uid;
  const allowed = await checkRateLimit(uid, 'mfaNotification', 2, 3600000); // 2 per hour
  if (!allowed) {
    throw new functions.https.HttpsError('resource-exhausted', 'Too many requests.');
  }

  try {
    const user = await getAuth().getUser(uid);
    await emailService.sendMFAEnrollmentNotification({
      email: user.email,
      displayName: user.displayName || '',
    });

    return { success: true };
  } catch (err) {
    console.error('sendMFAEnrollmentNotification error:', err);
    throw new functions.https.HttpsError('internal', 'Failed to send MFA notification.');
  }
});

/**
 * sendSupportRequest
 * Receives a support message from an authenticated user, verifies Premium status
 * server-side, and sends a tagged email to support@orary.app.
 * Rate limit: 3 requests per hour per user.
 */
exports.sendSupportRequest = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.');
  }

  const uid = context.auth.uid;

  // Rate limit: 3 support tickets per hour
  const allowed = await checkRateLimit(uid, 'supportRequest', 3, 3600000);
  if (!allowed) {
    throw new functions.https.HttpsError('resource-exhausted', 'Too many requests. Please wait before sending another message.');
  }

  const { subject, message } = data;

  if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
    throw new functions.https.HttpsError('invalid-argument', 'Subject is required (min 3 characters).');
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    throw new functions.https.HttpsError('invalid-argument', 'Message is required (min 10 characters).');
  }
  if (subject.trim().length > 120) {
    throw new functions.https.HttpsError('invalid-argument', 'Subject must be under 120 characters.');
  }
  if (message.trim().length > 3000) {
    throw new functions.https.HttpsError('invalid-argument', 'Message must be under 3000 characters.');
  }

  // Verify Premium status server-side — never trust the client.
  // trialing/cancelling users still have premium access, tag them accordingly.
  let isPremium = false;
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();
    isPremium =
      ['active', 'trialing', 'cancelling'].includes(userData?.subscription?.status) ||
      userData?.isPremiumTest === true;
  } catch (err) {
    console.error('sendSupportRequest: failed to read user doc:', err);
    // Non-fatal — treat as free user if Firestore fails
  }

  const firebaseUser = await getAuth().getUser(uid);
  const userEmail = firebaseUser.email || 'unknown';
  const displayName = firebaseUser.displayName || 'Unknown User';

  const tag = isPremium ? '[PREMIUM]' : '[FREE]';
  const emailSubject = `${tag} ${subject.trim()}`;

  // Escape user-controlled values before interpolating into the HTML email,
  // otherwise a user could inject markup/links into the support inbox.
  const escapeHtml = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const safeSubject = escapeHtml(subject.trim());
  const safeMessage = escapeHtml(message.trim());
  const safeDisplayName = escapeHtml(displayName);
  const safeEmail = escapeHtml(userEmail);

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:32px 16px;background:#f1f5f9;">
      <div style="background:#ffffff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#EC4899,#db2777);padding:24px 32px;text-align:center;">
          <img src="https://orary.app/assets/images/logo5.png" width="44" style="display:block;margin:0 auto 8px;background:#fff;border-radius:50%;padding:5px;" />
          <h1 style="margin:0;font-size:20px;color:#ffffff;font-weight:700;">Orary Support</h1>
        </div>
        <div style="padding:28px 32px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;width:90px;">From</td>
              <td style="padding:6px 0;font-size:13px;color:#1e293b;font-weight:600;">${safeDisplayName} &lt;${safeEmail}&gt;</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;">User ID</td>
              <td style="padding:6px 0;font-size:13px;color:#1e293b;font-family:monospace;">${uid}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;">Plan</td>
              <td style="padding:6px 0;">
                ${isPremium
                  ? '<span style="background:#FFF3CD;color:#D4A000;font-size:12px;font-weight:700;padding:2px 10px;border-radius:99px;">PREMIUM</span>'
                  : '<span style="background:#f1f5f9;color:#64748b;font-size:12px;font-weight:600;padding:2px 10px;border-radius:99px;">FREE</span>'
                }
              </td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />
          <h2 style="margin:0 0 12px;font-size:16px;color:#1e293b;">${safeSubject}</h2>
          <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
        </div>
        <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">Reply directly to this email to respond to the user.</p>
        </div>
      </div>
    </div>
  `;

  try {
    await emailService.sendEmail({
      to: 'support@orary.app',
      subject: emailSubject,
      html,
      replyTo: userEmail,
    });

    return { success: true, isPremium };
  } catch (err) {
    console.error('sendSupportRequest: email send failed:', err);
    throw new functions.https.HttpsError('internal', 'Failed to send support request.');
  }
});

// ============================================
// PAYSLIP PDF PARSER
// ============================================

// Lazy load para evitar costo de cold start en otras funciones
let _pdfParse = null;
const getPdfParse = () => {
  if (!_pdfParse) _pdfParse = require('pdf-parse');
  return _pdfParse;
};

let _Busboy = null;
const getBusboy = () => {
  if (!_Busboy) _Busboy = require('busboy');
  return _Busboy;
};

// ---------- Helpers para extraer campos del payslip ----------

const MONTH_MAP = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

const toNumber = (str) => {
  if (str === null || str === undefined) return null;
  const cleaned = String(str).replace(/[,\s$]/g, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
};

/**
 * Normaliza fechas en formatos comunes a YYYY-MM-DD.
 * Soporta: dd/mm/yyyy, dd-mm-yyyy, dd.mm.yyyy, yyyy-mm-dd,
 * "1 Apr 2026", "April 1 2026", "1-Apr-2026".
 */
function normalizeDate(str) {
  if (!str) return null;
  const raw = String(str).trim();

  // ISO directo
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  // "1 Apr 2026" / "1-April-2026" / "01 Apr 26"
  const monthNameRe = /^(\d{1,2})[\s\-./]+([A-Za-z]+)[\s\-./]+(\d{2,4})$/;
  const monthFirstRe = /^([A-Za-z]+)[\s\-./]+(\d{1,2}),?[\s\-./]+(\d{2,4})$/;
  let day, month, year;

  let m = raw.match(monthNameRe);
  if (m) {
    day = parseInt(m[1], 10);
    month = MONTH_MAP[m[2].toLowerCase().slice(0, 9)] || MONTH_MAP[m[2].toLowerCase().slice(0, 3)];
    year = parseInt(m[3], 10);
  } else if ((m = raw.match(monthFirstRe))) {
    month = MONTH_MAP[m[1].toLowerCase().slice(0, 9)] || MONTH_MAP[m[1].toLowerCase().slice(0, 3)];
    day = parseInt(m[2], 10);
    year = parseInt(m[3], 10);
  } else {
    const parts = raw.split(/[/\-.]/);
    if (parts.length !== 3) return null;
    if (parts[0].length === 4) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }
  }

  if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (year < 100) year += 2000;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Extrae *todas* las fechas de un texto (en cualquier formato soportado),
 * normalizadas a YYYY-MM-DD. Mantiene el orden de aparición.
 */
function extractAllDates(text) {
  const patterns = [
    /\b\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}\b/g,
    /\b\d{4}-\d{2}-\d{2}\b/g,
    /\b\d{1,2}[\s\-]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*[\s\-]+\d{2,4}\b/gi,
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*[\s\-]+\d{1,2},?[\s\-]+\d{2,4}\b/gi,
  ];
  const found = [];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text)) !== null) {
      const norm = normalizeDate(m[0]);
      if (norm) found.push({ date: norm, index: m.index });
    }
  }
  // Orden por aparición y dedup conservando primera ocurrencia
  found.sort((a, b) => a.index - b.index);
  const seen = new Set();
  return found.filter(({ date }) => {
    if (seen.has(date)) return false;
    seen.add(date);
    return true;
  });
}

/**
 * Busca un monto cercano a una etiqueta. Devuelve el primer match con un
 * número decimal en una ventana de ~80 chars después del label.
 */
function findAmountNear(text, labelRegex) {
  const re = new RegExp(labelRegex.source + '[\\s:.\\-]*\\$?\\s*([\\d,]+\\.\\d{2})', labelRegex.flags.includes('i') ? 'i' : 'i');
  const m = text.match(re);
  return m ? toNumber(m[1]) : null;
}

/**
 * Parsea el buffer del payslip e intenta extraer los campos relevantes.
 * Soporta payslips de Australia (PAYG) y Nueva Zelanda (PAYE), entre otros.
 *
 * Estrategia:
 *   1. Buscar gross/tax con etiquetas específicas, luego genéricas
 *   2. Buscar período con dos fechas asociadas a "pay period"/"period ending"
 *   3. Si solo hay una fecha, inferir el período según frecuencia detectada
 *      ("weekly" / "fortnightly" / "monthly")
 *   4. Buscar horas con etiquetas comunes
 *
 * Devuelve { gross, tax, periodStart, periodEnd, hours, frequency } o null.
 */
function extractPayslipFields(text) {
  if (!text || typeof text !== 'string') return null;

  const normalized = text.replace(/\r/g, '\n').replace(/[ \t]+/g, ' ');
  const lower = normalized.toLowerCase();

  // ----- GROSS -----
  // Etiquetas en orden de prioridad (más específicas primero)
  const grossLabels = [
    /total\s*gross\s*(?:earnings|pay|wages)?/i,
    /gross\s*(?:earnings|pay|wages|amount|income|salary)/i,
    /gross\s*for\s*period/i,
    /gross\s*ytd/i, // último recurso
    /\bgross\b/i,
    /\btotal\s*earnings\b/i,
    /\btotal\s*pay\b/i,
  ];
  let gross = null;
  for (const label of grossLabels) {
    const v = findAmountNear(normalized, label);
    if (v !== null) { gross = v; break; }
  }

  // ----- TAX -----
  const taxLabels = [
    /payg\s*withholding/i,
    /\bpayg\b/i,
    /\bpaye\b/i,
    /tax\s*withheld/i,
    /withholding\s*tax/i,
    /income\s*tax/i,
    /tax\s*deducted/i,
    /\btax\b/i,
  ];
  let tax = null;
  for (const label of taxLabels) {
    const v = findAmountNear(normalized, label);
    if (v !== null) { tax = v; break; }
  }

  // ----- HOURS -----
  const hoursLabels = [
    /total\s*hours\s*worked/i,
    /total\s*hours/i,
    /hours\s*worked/i,
    /ordinary\s*hours/i,
    /\bhours\b/i,
  ];
  let hours = null;
  for (const label of hoursLabels) {
    const re = new RegExp(label.source + '[\\s:.\\-]*([\\d]+(?:\\.\\d+)?)', 'i');
    const m = normalized.match(re);
    if (m) {
      const v = parseFloat(m[1]);
      // Filtro de sanidad: descartar valores irreales
      if (!isNaN(v) && v > 0 && v < 1000) { hours = v; break; }
    }
  }

  // ----- FRECUENCIA DEL PAGO -----
  let frequency = null;
  if (/\bweekly\b/i.test(lower)) frequency = 'weekly';
  else if (/\bfortnightly\b|\bbi[-\s]?weekly\b/i.test(lower)) frequency = 'fortnightly';
  else if (/\bmonthly\b/i.test(lower)) frequency = 'monthly';

  // ----- PERÍODO -----
  // Estrategia A: dos fechas en una misma línea cerca de etiquetas de período
  let periodStart = null;
  let periodEnd = null;

  const periodLineRe = /(?:pay\s*period|period\s*(?:ending|end|from|covered|of)|for\s*period|from)[:\s]*([^\n]{3,120})/i;
  const periodLine = normalized.match(periodLineRe);
  if (periodLine) {
    const datesInLine = extractAllDates(periodLine[1]);
    if (datesInLine.length >= 2) {
      const sorted = datesInLine.map(d => d.date).sort();
      periodStart = sorted[0];
      periodEnd = sorted[sorted.length - 1];
    } else if (datesInLine.length === 1) {
      // Una sola fecha en la línea de período: usar como fin y derivar inicio
      periodEnd = datesInLine[0].date;
    }
  }

  // Estrategia B: si seguimos sin período, mirar las primeras fechas del documento
  if (!periodStart && !periodEnd) {
    const allDates = extractAllDates(normalized);
    if (allDates.length >= 2) {
      // Tomar las dos primeras fechas y ordenarlas
      const sorted = [allDates[0].date, allDates[1].date].sort();
      periodStart = sorted[0];
      periodEnd = sorted[1];
    } else if (allDates.length === 1) {
      periodEnd = allDates[0].date;
    }
  }

  // Si tenemos solo periodEnd, derivar periodStart según frequency
  if (periodEnd && !periodStart) {
    const days = frequency === 'monthly' ? 30
      : frequency === 'fortnightly' ? 14
      : 7; // default semanal
    const end = new Date(periodEnd + 'T00:00:00Z');
    const start = new Date(end);
    start.setUTCDate(end.getUTCDate() - (days - 1));
    periodStart = start.toISOString().slice(0, 10);
  }

  // Validación de coherencia: periodStart no puede ser posterior a periodEnd
  if (periodStart && periodEnd && periodStart > periodEnd) {
    [periodStart, periodEnd] = [periodEnd, periodStart];
  }

  // Mínimo viable: gross y tax detectados
  if (gross === null || tax === null) return null;

  return { gross, tax, hours, periodStart, periodEnd, frequency };
}

/**
 * Lee el body multipart y devuelve el primer archivo encontrado como Buffer.
 */
function parseMultipartFile(req) {
  return new Promise((resolve, reject) => {
    try {
      const Busboy = getBusboy();
      const bb = Busboy({
        headers: req.headers,
        limits: { fileSize: 5 * 1024 * 1024, files: 1 },
      });

      let fileBuffer = null;
      let mimeType = null;
      let truncated = false;

      bb.on('file', (_name, file, info) => {
        mimeType = info?.mimeType || info?.mime || null;
        const chunks = [];
        file.on('data', (chunk) => chunks.push(chunk));
        file.on('limit', () => { truncated = true; });
        file.on('end', () => {
          if (!truncated) fileBuffer = Buffer.concat(chunks);
        });
      });

      bb.on('error', reject);
      bb.on('finish', () => {
        if (truncated) return reject(new Error('file-too-large'));
        if (!fileBuffer) return reject(new Error('no-file'));
        resolve({ buffer: fileBuffer, mimeType });
      });

      // En Cloud Functions, el body ya viene parseado como Buffer en req.rawBody
      if (req.rawBody) {
        bb.end(req.rawBody);
      } else {
        req.pipe(bb);
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * parsePDF
 * Recibe un PDF de payslip via multipart/form-data y devuelve los campos extraídos.
 * Si no se pueden extraer los mínimos (gross y tax), responde { success: false }
 * para que el frontend muestre el formulario manual.
 */
exports.parsePDF = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      // Rate limit: 10 parseos por minuto
      const allowed = await checkRateLimit(userId, 'parsePDF', 10, 60000);
      if (!allowed) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }

      let parsed;
      try {
        parsed = await parseMultipartFile(req);
      } catch (err) {
        if (err.message === 'file-too-large') {
          return res.status(413).json({ success: false, error: 'File too large' });
        }
        return res.status(400).json({ success: false, error: 'Invalid upload' });
      }

      if (parsed.mimeType && !parsed.mimeType.includes('pdf')) {
        return res.status(400).json({ success: false, error: 'Invalid file type' });
      }

      let pdfData;
      try {
        const pdfParse = getPdfParse();
        pdfData = await pdfParse(parsed.buffer);
      } catch (err) {
        return res.json({ success: false });
      }

      const fields = extractPayslipFields(pdfData?.text || '');
      if (!fields) {
        return res.json({ success: false });
      }

      return res.json({ success: true, data: fields });
    } catch (error) {
      console.error('parsePDF error:', error);
      return res.status(500).json({ success: false, error: 'Internal error' });
    }
  });
});
