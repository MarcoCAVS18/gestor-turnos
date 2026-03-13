// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Timestamp, FieldValue } = require('firebase-admin/firestore');
const emailService = require('./emailService');
// Lazy-loaded to avoid slow startup that causes deployment timeout
let _google = null;
const getGoogle = () => {
  if (!_google) _google = require('googleapis').google;
  return _google;
};
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

admin.initializeApp();
const db = admin.firestore();

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
async function checkRateLimit(userId, functionName, maxRequests = 10, windowMs = 60000) {
  const key = `${userId}_${functionName}`;
  const ref = db.collection('rate_limits').doc(key);

  const result = await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    const now = Date.now();

    if (!doc.exists) {
      transaction.set(ref, { count: 1, windowStart: now });
      return true;
    }

    const data = doc.data();
    const elapsed = now - data.windowStart;

    if (elapsed > windowMs) {
      // Window expired, reset
      transaction.update(ref, { count: 1, windowStart: now });
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

// Google OAuth2 Configuration
// These values come from .env file
const getOAuth2Client = () => {
  return new (getGoogle()).auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

// Scopes required for Google Calendar
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly'
];

// ============================================
// HTTP FUNCTIONS - OAuth Flow
// ============================================

/**
 * Get the Google OAuth authorization URL
 * Called when user clicks "Connect Google Calendar"
 */
exports.getGoogleAuthUrl = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Verify Firebase Auth token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const oauth2Client = getOAuth2Client();

      // Generate a secure random state token for CSRF protection
      const stateToken = crypto.randomBytes(32).toString('hex');

      // Store state → userId mapping in Firestore (expires in 10 minutes)
      await db.collection('oauth_states').doc(stateToken).set({
        userId,
        createdAt: FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
        state: stateToken
      });

      res.json({ url: authUrl });
    } catch (error) {
      console.error('Error generating auth URL:', error);
      res.status(500).json({ error: 'Failed to generate auth URL' });
    }
  });
});

/**
 * OAuth callback - exchanges code for tokens and stores them
 */
exports.googleAuthCallback = functions.https.onRequest(async (req, res) => {
  try {
    const { code, state: stateToken } = req.query;

    if (!code || !stateToken) {
      return res.status(400).send('Missing code or state parameter');
    }

    // Validate state token against stored value (CSRF protection)
    const stateDoc = await db.collection('oauth_states').doc(stateToken).get();
    if (!stateDoc.exists()) {
      return res.status(403).send('Invalid or expired state token');
    }

    const stateData = stateDoc.data();
    const userId = stateData.userId;

    // Check expiration
    if (stateData.expiresAt && stateData.expiresAt.toDate() < new Date()) {
      await db.collection('oauth_states').doc(stateToken).delete();
      return res.status(403).send('State token expired');
    }

    // Delete used state token (single-use)
    await db.collection('oauth_states').doc(stateToken).delete();

    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    // Store tokens securely in Firestore
    await db.collection('users').doc(userId).collection('private').doc('googleCalendar').set({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
      connected: true,
      connectedAt: FieldValue.serverTimestamp()
    });

    // Update user's public profile to show calendar is connected
    await db.collection('users').doc(userId).update({
      googleCalendarConnected: true
    });

    const appUrl = getAppUrl();
    res.redirect(`${appUrl}/integrations?calendar=connected`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    const appUrl = getAppUrl();
    res.redirect(`${appUrl}/integrations?calendar=error`);
  }
});

/**
 * Disconnect Google Calendar
 */
exports.disconnectGoogleCalendar = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      // Delete stored tokens
      await db.collection('users').doc(userId).collection('private').doc('googleCalendar').delete();

      // Update user profile
      await db.collection('users').doc(userId).update({
        googleCalendarConnected: false
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error disconnecting:', error);
      res.status(500).json({ error: 'Failed to disconnect' });
    }
  });
});

/**
 * Get connection status
 */
exports.getCalendarStatus = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const calendarDoc = await db.collection('users').doc(userId)
        .collection('private').doc('googleCalendar').get();

      if (!calendarDoc.exists) {
        return res.json({ connected: false });
      }

      const data = calendarDoc.data();
      res.json({
        connected: data.connected || false,
        connectedAt: data.connectedAt
      });
    } catch (error) {
      console.error('Error getting status:', error);
      res.status(500).json({ error: 'Failed to get status' });
    }
  });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get authenticated Google Calendar client for a user
 */
async function getCalendarClient(userId) {
  const calendarDoc = await db.collection('users').doc(userId)
    .collection('private').doc('googleCalendar').get();

  if (!calendarDoc.exists) {
    throw new Error('Google Calendar not connected');
  }

  const tokens = calendarDoc.data();
  const oauth2Client = getOAuth2Client();

  oauth2Client.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expiry_date: tokens.expiryDate
  });

  // Handle token refresh
  oauth2Client.on('tokens', async (newTokens) => {
    const updateData = {
      accessToken: newTokens.access_token,
      expiryDate: newTokens.expiry_date
    };
    if (newTokens.refresh_token) {
      updateData.refreshToken = newTokens.refresh_token;
    }
    await db.collection('users').doc(userId)
      .collection('private').doc('googleCalendar').update(updateData);
  });

  return getGoogle().calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Format shift data for Google Calendar event
 */
function formatShiftForCalendar(shift, work) {
  const startDate = new Date(shift.date);
  const [startHour, startMin] = (shift.startTime || '09:00').split(':').map(Number);
  const [endHour, endMin] = (shift.endTime || '17:00').split(':').map(Number);

  const startDateTime = new Date(startDate);
  startDateTime.setHours(startHour, startMin, 0, 0);

  const endDateTime = new Date(startDate);
  endDateTime.setHours(endHour, endMin, 0, 0);

  // Handle overnight shifts
  if (endDateTime <= startDateTime) {
    endDateTime.setDate(endDateTime.getDate() + 1);
  }

  const workName = work?.name || 'Work Shift';
  const workColor = work?.color || '#EC4899';

  return {
    summary: `${workName} - Shift`,
    description: `Shift at ${workName}\n\nManaged by Gestor Turnos`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'America/Argentina/Buenos_Aires'
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'America/Argentina/Buenos_Aires'
    },
    colorId: getGoogleCalendarColorId(workColor),
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 },
        { method: 'popup', minutes: 10 }
      ]
    }
  };
}

/**
 * Map hex color to Google Calendar color ID
 */
function getGoogleCalendarColorId(hexColor) {
  // Google Calendar has predefined colors (1-11)
  // Map common colors to closest match
  const colorMap = {
    '#EC4899': '4', // Pink -> Flamingo
    '#F43F5E': '11', // Rose -> Tomato
    '#EF4444': '11', // Red -> Tomato
    '#F97316': '6', // Orange -> Tangerine
    '#EAB308': '5', // Yellow -> Banana
    '#22C55E': '10', // Green -> Basil
    '#10B981': '2', // Emerald -> Sage
    '#14B8A6': '7', // Teal -> Peacock
    '#06B6D4': '7', // Cyan -> Peacock
    '#3B82F6': '9', // Blue -> Blueberry
    '#6366F1': '1', // Indigo -> Lavender
    '#8B5CF6': '1', // Violet -> Lavender
    '#A855F7': '3', // Purple -> Grape
    '#D946EF': '3', // Fuchsia -> Grape
  };
  return colorMap[hexColor] || '8'; // Default: Graphite
}

// ============================================
// FIRESTORE TRIGGERS - Auto Sync
// ============================================

/**
 * When a shift is created, add it to Google Calendar
 */
exports.onShiftCreated = functions.firestore
  .document('shifts/{shiftId}')
  .onCreate(async (snapshot, context) => {
    const shift = snapshot.data();
    const shiftId = context.params.shiftId;
    const userId = shift.userId;

    try {
      // Check if user has calendar connected
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists || !userDoc.data().googleCalendarConnected) {
        return null;
      }

      // Get work details
      const workDoc = await db.collection('works').doc(shift.workId).get();
      const work = workDoc.exists ? workDoc.data() : null;

      // Create calendar event
      const calendar = await getCalendarClient(userId);
      const event = formatShiftForCalendar(shift, work);

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      // Store the Google Calendar event ID for future updates/deletes
      await snapshot.ref.update({
        googleCalendarEventId: response.data.id
      });

      console.log(`Created calendar event for shift ${shiftId}`);
    } catch (error) {
      console.error(`Error creating calendar event for shift ${shiftId}:`, error);
    }
  });

/**
 * When a shift is updated, update the Google Calendar event
 */
exports.onShiftUpdated = functions.firestore
  .document('shifts/{shiftId}')
  .onUpdate(async (change, context) => {
    const newShift = change.after.data();
    const oldShift = change.before.data();
    const shiftId = context.params.shiftId;
    const userId = newShift.userId;

    // Skip if only googleCalendarEventId changed (to avoid infinite loop)
    if (oldShift.googleCalendarEventId !== newShift.googleCalendarEventId &&
        Object.keys(newShift).length === Object.keys(oldShift).length) {
      return null;
    }

    // Skip if no calendar event exists
    if (!newShift.googleCalendarEventId) {
      return null;
    }

    try {
      // Check if user has calendar connected
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists || !userDoc.data().googleCalendarConnected) {
        return null;
      }

      // Get work details
      const workDoc = await db.collection('works').doc(newShift.workId).get();
      const work = workDoc.exists ? workDoc.data() : null;

      // Update calendar event
      const calendar = await getCalendarClient(userId);
      const event = formatShiftForCalendar(newShift, work);

      await calendar.events.update({
        calendarId: 'primary',
        eventId: newShift.googleCalendarEventId,
        resource: event
      });

      console.log(`Updated calendar event for shift ${shiftId}`);
    } catch (error) {
      console.error(`Error updating calendar event for shift ${shiftId}:`, error);
    }
  });

/**
 * When a shift is deleted, remove it from Google Calendar
 */
exports.onShiftDeleted = functions.firestore
  .document('shifts/{shiftId}')
  .onDelete(async (snapshot, context) => {
    const shift = snapshot.data();
    const shiftId = context.params.shiftId;
    const userId = shift.userId;

    if (!shift.googleCalendarEventId) {
      return null;
    }

    try {
      // Check if user has calendar connected
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists || !userDoc.data().googleCalendarConnected) {
        return null;
      }

      // Delete calendar event
      const calendar = await getCalendarClient(userId);

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: shift.googleCalendarEventId
      });

      console.log(`Deleted calendar event for shift ${shiftId}`);
    } catch (error) {
      // Ignore 404 errors (event already deleted)
      if (error.code !== 404) {
        console.error(`Error deleting calendar event for shift ${shiftId}:`, error);
      }
    }
  });

/**
 * Manual sync - sync all existing shifts to calendar
 */
exports.syncAllShiftsToCalendar = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      // Get all shifts without calendar events
      const shiftsSnapshot = await db.collection('shifts')
        .where('userId', '==', userId)
        .where('googleCalendarEventId', '==', null)
        .get();

      if (shiftsSnapshot.empty) {
        return res.json({ synced: 0, message: 'All shifts already synced' });
      }

      const calendar = await getCalendarClient(userId);
      let synced = 0;

      for (const shiftDoc of shiftsSnapshot.docs) {
        const shift = shiftDoc.data();

        // Get work details
        const workDoc = await db.collection('works').doc(shift.workId).get();
        const work = workDoc.exists ? workDoc.data() : null;

        try {
          const event = formatShiftForCalendar(shift, work);
          const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event
          });

          await shiftDoc.ref.update({
            googleCalendarEventId: response.data.id
          });

          synced++;
        } catch (error) {
          console.error(`Error syncing shift ${shiftDoc.id}:`, error);
        }
      }

      res.json({ synced, total: shiftsSnapshot.size });
    } catch (error) {
      console.error('Error syncing shifts:', error);
      res.status(500).json({ error: 'Failed to sync shifts' });
    }
  });
});

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
      const decodedToken = await admin.auth().verifyIdToken(idToken);
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

      // Race condition protection: use Firestore transaction with lock
      const lockRef = db.collection('subscription_locks').doc(userId);
      const lockDoc = await lockRef.get();
      if (lockDoc.exists) {
        const lockData = lockDoc.data();
        const lockAge = Date.now() - (lockData.createdAt?.toMillis() || 0);
        // If lock is less than 30 seconds old, reject (concurrent request)
        if (lockAge < 30000) {
          return res.status(409).json({ error: 'Subscription creation already in progress' });
        }
      }
      // Set lock
      await lockRef.set({ createdAt: FieldValue.serverTimestamp(), userId });

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

      // Check for existing active/trialing subscription — avoids duplicates when payment
      // succeeded in Stripe but Firestore wasn't updated (e.g. server returned 500 mid-flow).
      // Search across ALL Stripe customers for this Firebase user using two strategies:
      // 1. metadata search (customers created with firebaseUserId metadata)
      // 2. email search (fallback for customers created without metadata)
      const [metadataCustomers, emailCustomers] = await Promise.all([
        stripe.customers.search({
          query: `metadata['firebaseUserId']:'${userId}'`,
          limit: 10,
        }),
        stripe.customers.list({ email: email, limit: 10 }),
      ]);
      const seenIds = new Set();
      const allCustomerIds = [customerId, ...metadataCustomers.data.map((c) => c.id), ...emailCustomers.data.map((c) => c.id)]
        .filter((id) => {
          if (!id || seenIds.has(id)) return false;
          seenIds.add(id);
          return true;
        });
      const customerIdsToCheck = allCustomerIds;

      let resolvedSub = null;
      let resolvedCustomerId = customerId;

      for (const custId of customerIdsToCheck) {
        const existingSubs = await stripe.subscriptions.list({
          customer: custId,
          price: priceId,
          status: 'all',
          limit: 10,
        });

        // First look for clearly active/trialing subs
        let found = existingSubs.data.find(
          (s) => s.status === 'active' || s.status === 'trialing'
        );

        // Also check incomplete subs — Stripe transitions incomplete→active asynchronously
        // after invoice payment, so there can be a gap where the sub looks incomplete but IS paid.
        if (!found) {
          for (const sub of existingSubs.data.filter((s) => s.status === 'incomplete')) {
            const invId = typeof sub.latest_invoice === 'string'
              ? sub.latest_invoice
              : sub.latest_invoice?.id;
            if (invId) {
              const inv = await stripe.invoices.retrieve(invId);
              if (inv.paid || inv.status === 'paid') {
                console.log('Incomplete sub with paid invoice found:', sub.id);
                found = sub;
                break;
              }
            }
          }
        }

        if (found) {
          resolvedSub = found;
          resolvedCustomerId = custId;
          break;
        }
      }

      if (resolvedSub) {
        console.log('Existing subscription found:', resolvedSub.id, resolvedSub.status, 'customer:', resolvedCustomerId);
        const periodEnd = resolvedSub.current_period_end;
        const expiryMillis = periodEnd ? periodEnd * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000);
        await db.collection('users').doc(userId).update({
          subscription: {
            isPremium: true,
            plan: 'premium',
            status: 'active',
            stripeCustomerId: resolvedCustomerId,
            stripeSubscriptionId: resolvedSub.id,
            startDate: now,
            expiryDate: Timestamp.fromMillis(expiryMillis),
            paymentMethod: `**** ${paymentMethodId.slice(-4)}`,
          },
        });
        return res.json({ status: 'success', subscriptionId: resolvedSub.id });
      }

      // Check if this user has already used a free trial (survives "Clear Everything")
      const trialRecord = await db.collection('trial_records').doc(userId).get();
      const trialAlreadyUsed = trialRecord.exists;

      // Create subscription — only offer trial to first-time users.
      // For returning users: trial_end: 'now' overrides any trial period defined on the
      // price object itself, forcing an immediate billable invoice with a payment_intent.
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
        expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
        metadata: {
          firebaseUserId: userId,
        },
      });

      // Handle trial subscriptions — no payment needed yet, card saved for later
      if (subscription.status === 'trialing') {
        const trialEnd = subscription.trial_end;
        const trialEndMillis = trialEnd ? trialEnd * 1000 : Date.now() + (15 * 24 * 60 * 60 * 1000);

        // Record trial usage so it persists across "Clear Everything"
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
            paymentMethod: `**** ${paymentMethodId.slice(-4)}`,
          },
        });

        return res.json({
          status: 'trial',
          trialEnd: trialEnd,
          setupClientSecret: subscription.pending_setup_intent?.client_secret || null,
          subscriptionId: subscription.id,
        });
      }

      // ========== NO TRIAL - PAYMENT REQUIRED IMMEDIATELY ==========
      // Standard Stripe pattern: return clientSecret to frontend.
      // Stripe.js (confirmCardPayment) handles all scenarios natively:
      // direct payment, 3DS authentication, etc.
      // After frontend confirms, verifyAndActivateSubscription updates Firestore.

      // Fast path: subscription already active (e.g. saved card auto-charged)
      if (subscription.status === 'active') {
        const periodEnd = subscription.current_period_end;
        const expiryMillis = periodEnd ? periodEnd * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000);
        await db.collection('users').doc(userId).update({
          subscription: {
            isPremium: true,
            plan: 'premium',
            status: 'active',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            startDate: now,
            expiryDate: Timestamp.fromMillis(expiryMillis),
            paymentMethod: `**** ${paymentMethodId.slice(-4)}`,
          },
        });
        return res.json({ status: 'success', subscriptionId: subscription.id });
      }

      // Get invoice ID from the subscription response
      const rawInvoice = subscription.latest_invoice;
      const invoiceId = typeof rawInvoice === 'string' ? rawInvoice : rawInvoice?.id;

      if (!invoiceId) {
        throw new Error('No invoice found for subscription');
      }

      // Fetch the invoice fresh to get accurate state
      let invoice = await stripe.invoices.retrieve(invoiceId, {
        expand: ['payment_intent'],
      });

      console.log('Invoice state after subscription create:', JSON.stringify({
        id: invoice.id,
        status: invoice.status,
        amount_due: invoice.amount_due,
        collection_method: invoice.collection_method,
        paid: invoice.paid,
        has_payment_intent: !!invoice.payment_intent,
        payment_intent_id: typeof invoice.payment_intent === 'object'
          ? invoice.payment_intent?.id
          : invoice.payment_intent,
        payment_intent_status: typeof invoice.payment_intent === 'object'
          ? invoice.payment_intent?.status
          : null,
      }));

      // Handle zero-amount or already-paid invoice (covered by credit balance, etc.)
      if (invoice.amount_due === 0 || invoice.paid) {
        console.log('Invoice zero/paid — checking subscription status');
        const freshSub = await stripe.subscriptions.retrieve(subscription.id);
        if (freshSub.status === 'active') {
          const periodEnd = freshSub.current_period_end;
          const expiryMillis = periodEnd ? periodEnd * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000);
          await db.collection('users').doc(userId).update({
            subscription: {
              isPremium: true,
              plan: 'premium',
              status: 'active',
              stripeCustomerId: customerId,
              stripeSubscriptionId: freshSub.id,
              startDate: now,
              expiryDate: Timestamp.fromMillis(expiryMillis),
              paymentMethod: `**** ${paymentMethodId.slice(-4)}`,
            },
          });
          return res.json({ status: 'success', subscriptionId: freshSub.id });
        }
      }

      // Finalize draft invoice so Stripe creates the PaymentIntent
      if (invoice.status === 'draft') {
        console.log('Invoice is draft, finalizing:', invoiceId);
        invoice = await stripe.invoices.finalizeInvoice(invoiceId, {
          expand: ['payment_intent'],
        });
      }

      // Check if PI already exists on the invoice (happy path)
      let pi = typeof invoice.payment_intent === 'string'
        ? await stripe.paymentIntents.retrieve(invoice.payment_intent)
        : invoice.payment_intent;

      // If no PI yet, explicitly trigger payment via invoices.pay().
      // This is more reliable than waiting for Stripe to attach the PI asynchronously.
      // off_session: false allows on-session 3DS authentication (PI goes to requires_action
      // instead of throwing an error), so the frontend can handle it with confirmCardPayment.
      if (!pi && invoice.status === 'open') {
        console.log('No PI on invoice — calling invoices.pay() to trigger payment...');
        try {
          const paidInvoice = await stripe.invoices.pay(invoiceId, {
            payment_method: paymentMethodId,
            off_session: false,
            expand: ['payment_intent'],
          });

          console.log('invoices.pay() result:', JSON.stringify({
            paid: paidInvoice.paid,
            status: paidInvoice.status,
            pi_status: typeof paidInvoice.payment_intent === 'object'
              ? paidInvoice.payment_intent?.status
              : null,
          }));

          if (paidInvoice.paid || paidInvoice.status === 'paid') {
            // Payment succeeded immediately (card charge or customer credit balance) — activate subscription
            const freshSub = await stripe.subscriptions.retrieve(subscription.id);
            const periodEnd = freshSub.current_period_end;
            const expiryMillis = periodEnd ? periodEnd * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000);
            await db.collection('users').doc(userId).update({
              subscription: {
                isPremium: true,
                plan: 'premium',
                status: 'active',
                stripeCustomerId: customerId,
                stripeSubscriptionId: freshSub.id,
                startDate: now,
                expiryDate: Timestamp.fromMillis(expiryMillis),
                paymentMethod: `**** ${paymentMethodId.slice(-4)}`,
              },
            });
            return res.json({ status: 'success', subscriptionId: freshSub.id });
          }

          pi = typeof paidInvoice.payment_intent === 'string'
            ? await stripe.paymentIntents.retrieve(paidInvoice.payment_intent)
            : paidInvoice.payment_intent;
        } catch (payErr) {
          // invoices.pay() may throw even with off_session:false in some edge cases.
          // Retrieve the PI from the invoice directly.
          console.log('invoices.pay() threw:', payErr.code, payErr.message);
          const freshInvoice = await stripe.invoices.retrieve(invoiceId, {
            expand: ['payment_intent'],
          });
          pi = typeof freshInvoice.payment_intent === 'string'
            ? await stripe.paymentIntents.retrieve(freshInvoice.payment_intent)
            : freshInvoice.payment_intent;

          if (!pi) throw payErr; // re-throw original if PI still not found
        }
      }

      if (!pi) {
        console.error('No payment intent found for subscription:', subscription.id, {
          subscriptionStatus: subscription.status,
          invoiceId,
          invoiceStatus: invoice.status,
        });
        throw new Error('Could not initialize payment. Please try again.');
      }

      console.log('Returning clientSecret for PI:', pi.id, 'status:', pi.status);

      // Return clientSecret to frontend — Stripe.js handles confirmation + 3DS natively.
      // Frontend calls verifyAndActivateSubscription after stripe.confirmCardPayment succeeds.
      return res.json({
        status: 'requires_payment',
        clientSecret: pi.client_secret,
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
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;
      const email = decodedToken.email;

      const priceId = process.env.STRIPE_PRICE_ID;
      if (!priceId) {
        return res.status(500).json({ error: 'Payment system not configured.' });
      }

      // Search by metadata AND email to find all customers for this user
      const [metadataCustomers, emailCustomers] = await Promise.all([
        stripe.customers.search({
          query: `metadata['firebaseUserId']:'${userId}'`,
          limit: 10,
        }),
        stripe.customers.list({ email, limit: 10 }),
      ]);

      const seenIds = new Set();
      const customerIds = [...metadataCustomers.data.map((c) => c.id), ...emailCustomers.data.map((c) => c.id)]
        .filter((id) => { if (seenIds.has(id)) return false; seenIds.add(id); return true; });

      let activeSub = null;
      let activeCustomerId = null;

      for (const custId of customerIds) {
        const subs = await stripe.subscriptions.list({
          customer: custId,
          status: 'all',
          limit: 20,
        });
        const found = subs.data.find((s) => s.status === 'active' || s.status === 'trialing');
        if (found) {
          activeSub = found;
          activeCustomerId = custId;
          break;
        }
      }

      if (!activeSub) {
        return res.status(404).json({ error: 'No active subscription found in Stripe.' });
      }

      const now = Timestamp.now();
      const periodEnd = activeSub.current_period_end;
      const expiryMillis = periodEnd ? periodEnd * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000);

      await db.collection('users').doc(userId).update({
        subscription: {
          isPremium: true,
          plan: 'premium',
          status: activeSub.status,
          stripeCustomerId: activeCustomerId,
          stripeSubscriptionId: activeSub.id,
          startDate: now,
          expiryDate: Timestamp.fromMillis(expiryMillis),
        },
      });

      console.log(`activateExistingSubscription: activated ${activeSub.id} for user ${userId}`);
      return res.json({ status: 'success', subscriptionId: activeSub.id, customerId: activeCustomerId });
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
      const decodedToken = await admin.auth().verifyIdToken(idToken);
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
            'subscription.status': 'canceled',
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
            'subscription.status': 'canceled',
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
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const { subscriptionId } = req.body;
      if (!subscriptionId) {
        return res.status(400).json({ error: 'Missing subscriptionId' });
      }

      // Retrieve subscription from Stripe to get authoritative status
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Security: ensure this subscription belongs to the requesting user
      if (subscription.metadata?.firebaseUserId !== userId) {
        return res.status(403).json({ error: 'Subscription does not belong to this user' });
      }

      if (!['active', 'trialing'].includes(subscription.status)) {
        return res.status(400).json({
          error: `Subscription payment not yet confirmed (status: ${subscription.status})`,
        });
      }

      const now = Timestamp.now();
      const periodEnd = subscription.current_period_end;
      const expiryMillis = periodEnd ? periodEnd * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000);
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id;

      await db.collection('users').doc(userId).update({
        subscription: {
          isPremium: true,
          plan: 'premium',
          status: 'active',
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          startDate: now,
          expiryDate: Timestamp.fromMillis(expiryMillis),
        },
      });

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
      const decodedToken = await admin.auth().verifyIdToken(idToken);
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
        return_url: process.env.APP_URL + '/premium',
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
      const decodedToken = await admin.auth().verifyIdToken(idToken);
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

  // Handle the event
  switch (event.type) {
    case 'invoice.paid': {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      // Find user by Stripe customer ID
      const usersSnapshot = await db.collection('users')
        .where('subscription.stripeCustomerId', '==', customerId)
        .limit(1)
        .get();

      if (!usersSnapshot.empty) {
        const userDoc = usersSnapshot.docs[0];
        const userData = userDoc.data() || {};
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);

        // Safely calculate expiry date
        const periodEnd = subscription.current_period_end;
        const expiryMillis = periodEnd ? periodEnd * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000);

        await userDoc.ref.update({
          'subscription.isPremium': true,
          'subscription.status': 'active',
          'subscription.expiryDate': Timestamp.fromMillis(expiryMillis),
        });

        console.log(`Invoice paid for user ${userDoc.id}`);

        // Send payment confirmation email (fire-and-forget)
        const userEmail = userData.email || (await admin.auth().getUser(userDoc.id)).email;
        if (userEmail) {
          const nextBillingDate = periodEnd
            ? new Date(periodEnd * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : 'next month';
          const priceAmount = invoice.amount_paid;
          const currency = (invoice.currency || 'aud').toUpperCase();
          const formattedAmount = priceAmount
            ? `${(priceAmount / 100).toFixed(2)} ${currency} / month`
            : 'Premium';
          emailService.sendSubscriptionConfirmationEmail({
            email: userEmail,
            displayName: userData.displayName || userData.name || '',
            amount: formattedAmount,
            nextBillingDate,
            invoiceUrl: invoice.hosted_invoice_url || null,
          }).catch((err) => console.warn('Failed to send subscription confirmation email:', err.message));
        }
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      const usersSnapshot = await db.collection('users')
        .where('subscription.stripeCustomerId', '==', customerId)
        .limit(1)
        .get();

      if (!usersSnapshot.empty) {
        const userDoc = usersSnapshot.docs[0];
        await userDoc.ref.update({
          'subscription.status': 'past_due',
        });
        console.log(`Payment failed for user ${userDoc.id}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      const usersSnapshot = await db.collection('users')
        .where('subscription.stripeCustomerId', '==', customerId)
        .limit(1)
        .get();

      if (!usersSnapshot.empty) {
        const userDoc = usersSnapshot.docs[0];
        await userDoc.ref.update({
          'subscription.isPremium': false,
          'subscription.status': 'cancelled',
          'subscription.plan': 'free',
        });
        console.log(`Subscription cancelled for user ${userDoc.id}`);
      }
      break;
    }

    case 'customer.subscription.trial_will_end': {
      // Fired 3 days before trial ends — flag user so UI can show a notice
      const trialSub = event.data.object;
      const trialCustomerId = trialSub.customer;

      const trialUsersSnapshot = await db.collection('users')
        .where('subscription.stripeCustomerId', '==', trialCustomerId)
        .limit(1)
        .get();

      if (!trialUsersSnapshot.empty) {
        const userDoc = trialUsersSnapshot.docs[0];
        await userDoc.ref.update({
          'subscription.trialEndingSoon': true,
        });
        console.log(`Trial ending soon for user ${userDoc.id}`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      // Handle trial → active transition (belt-and-suspenders; invoice.paid also covers this)
      const updatedSub = event.data.object;
      const prevStatus = event.data.previous_attributes?.status;

      if (updatedSub.status === 'active' && prevStatus === 'trialing') {
        const updatedCustomerId = updatedSub.customer;
        const updatedUsersSnapshot = await db.collection('users')
          .where('subscription.stripeCustomerId', '==', updatedCustomerId)
          .limit(1)
          .get();

        if (!updatedUsersSnapshot.empty) {
          const userDoc = updatedUsersSnapshot.docs[0];
          const periodEnd = updatedSub.current_period_end;
          const expiryMillis = periodEnd ? periodEnd * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000);
          await userDoc.ref.update({
            'subscription.status': 'active',
            'subscription.expiryDate': Timestamp.fromMillis(expiryMillis),
            'subscription.trialEnd': null,
            'subscription.trialEndingSoon': null,
          });
          console.log(`Trial converted to active for user ${userDoc.id}`);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Mark event as processed for idempotency
  await eventRef.set({
    type: event.type,
    processedAt: FieldValue.serverTimestamp(),
  });

  res.json({ received: true });
});

// ============================================
// CALENDAR FEED - WebCal ICS Subscription
// ============================================

/**
 * Format a date+time string pair into ICS local datetime format.
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {string} timeStr - "HH:mm"
 * @returns {string} e.g. "20260227T090000"
 */
function formatDateForICS(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-');
  const [hour, minute] = timeStr.split(':');
  return `${year}${month}${day}T${hour}${minute}00`;
}

/**
 * Escape special characters for ICS text fields.
 */
function escapeICSText(text) {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

/**
 * Build a complete ICS calendar string from an array of shifts.
 * @param {Array} shifts - shift objects with id, startDate, startTime, endDate, endTime, notes, workId
 * @param {Object} worksMap - { [workId]: { name } }
 * @param {string} timezone - IANA timezone string e.g. "Australia/Sydney"
 * @returns {string}
 */
function generateICS(shifts, worksMap, timezone) {
  const tz = timezone || 'UTC';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Orary//Shift Manager//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Orary - My Shifts',
    `X-WR-TIMEZONE:${tz}`,
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
    'X-PUBLISHED-TTL:PT6H',
  ];

  const dtstamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  for (const shift of shifts) {
    const work = worksMap[shift.workId];
    const workName = work?.name || 'Shift';
    const endDate = shift.endDate || shift.startDate;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:shift-${shift.id}@orary.app`);
    // Use TZID so calendar apps render events in the user's local time, not UTC
    lines.push(`DTSTART;TZID=${tz}:${formatDateForICS(shift.startDate, shift.startTime)}`);
    lines.push(`DTEND;TZID=${tz}:${formatDateForICS(endDate, shift.endTime)}`);
    lines.push(`SUMMARY:${escapeICSText(workName)}`);
    if (shift.notes) lines.push(`DESCRIPTION:${escapeICSText(shift.notes)}`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

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
      const decoded = await admin.auth().verifyIdToken(idToken);
      uid = decoded.uid;
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Accept timezone from request body
    let timezone = 'UTC';
    try {
      const body = req.body || {};
      if (body.timezone && typeof body.timezone === 'string') {
        timezone = body.timezone;
      }
    } catch { /* ignore */ }

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
  if (!uid || !token) return res.status(400).send('Missing uid or token');

  // Validate token
  const userDoc = await db.collection('users').doc(uid).get();
  if (!userDoc.exists || userDoc.data().calendarToken !== token) {
    return res.status(403).send('Forbidden');
  }

  const timezone = userDoc.data().calendarTimezone || 'UTC';

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
 * HTTP-triggered cleanup function for expired shared_works documents.
 * Shared works have a 48-hour expiration (expiresAt field).
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
    const now = admin.firestore.Timestamp.now();
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

    console.log(`Cleanup: deleted ${totalDeleted} expired shared works`);
    res.json({ success: true, deleted: totalDeleted });
  } catch (error) {
    console.error('Cleanup error:', error.message);
    res.status(500).json({ error: 'Cleanup failed' });
  }
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
    const user = await admin.auth().getUser(uid);
    if (user.emailVerified) {
      return { success: true, alreadyVerified: true };
    }

    const link = await admin.auth().generateEmailVerificationLink(user.email, {
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
    const link = await admin.auth().generatePasswordResetLink(email, {
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
    const user = await admin.auth().getUser(uid);
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
    const user = await admin.auth().getUser(uid);
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
