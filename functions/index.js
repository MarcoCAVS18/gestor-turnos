// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const cors = require('cors')({ origin: true });
require('dotenv').config();

// Initialize Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();
const db = admin.firestore();

// Google OAuth2 Configuration
// These values come from .env file
const getOAuth2Client = () => {
  return new google.auth.OAuth2(
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

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
        state: userId // Pass userId to callback
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
    const { code, state: userId } = req.query;

    if (!code || !userId) {
      return res.status(400).send('Missing code or state parameter');
    }

    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    // Store tokens securely in Firestore
    await db.collection('users').doc(userId).collection('private').doc('googleCalendar').set({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
      connected: true,
      connectedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update user's public profile to show calendar is connected
    await db.collection('users').doc(userId).update({
      googleCalendarConnected: true
    });

    // Redirect back to the app
    const appUrl = process.env.APP_URL || 'https://gestionturnos-7ec99.web.app';
    res.redirect(`${appUrl}/integrations?calendar=connected`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    const appUrl = process.env.APP_URL || 'https://gestionturnos-7ec99.web.app';
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

  return google.calendar({ version: 'v3', auth: oauth2Client });
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

      const { paymentMethodId, email, name } = req.body;

      if (!paymentMethodId || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user already has a Stripe customer ID
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data() || {};
      let customerId = userData.subscription?.stripeCustomerId;

      // Create or retrieve Stripe customer
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: email,
          name: name || undefined,
          payment_method: paymentMethodId,
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
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
        await stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
      }

      // Check if STRIPE_PRICE_ID is configured
      const priceId = process.env.STRIPE_PRICE_ID;
      if (!priceId || priceId === 'price_XXXXX') {
        console.error('STRIPE_PRICE_ID is not configured!');
        return res.status(500).json({
          error: 'Payment system not configured. Please contact support.',
        });
      }

      // Create subscription with automatic invoicing
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          firebaseUserId: userId,
        },
      });

      const invoice = subscription.latest_invoice;
      const paymentIntent = invoice?.payment_intent;

      // Check if paymentIntent exists
      if (!paymentIntent) {
        console.error('No payment intent found for subscription:', subscription.id);
        // Subscription was created but no payment needed (could be trial, etc.)
        // Still update Firestore as premium
        const now = admin.firestore.Timestamp.now();
        // Safely calculate expiry date - default to 30 days from now if not available
        const periodEnd = subscription.current_period_end;
        const expiryMillis = periodEnd ? periodEnd * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000);
        const expiryDate = admin.firestore.Timestamp.fromMillis(expiryMillis);

        await db.collection('users').doc(userId).update({
          subscription: {
            isPremium: true,
            plan: 'premium',
            status: 'active',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            startDate: now,
            expiryDate: expiryDate,
            paymentMethod: `**** ${paymentMethodId.slice(-4)}`,
          },
        });

        return res.json({
          status: 'success',
          subscriptionId: subscription.id,
          message: 'Subscription created successfully!',
        });
      }

      // If payment requires action (3D Secure, etc.)
      if (paymentIntent.status === 'requires_action') {
        return res.json({
          status: 'requires_action',
          clientSecret: paymentIntent.client_secret,
          subscriptionId: subscription.id,
        });
      }

      // Payment successful - update Firestore
      if (paymentIntent.status === 'succeeded') {
        const now = admin.firestore.Timestamp.now();
        // Safely calculate expiry date - default to 30 days from now if not available
        const periodEnd = subscription.current_period_end;
        const expiryMillis = periodEnd ? periodEnd * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000);
        const expiryDate = admin.firestore.Timestamp.fromMillis(expiryMillis);

        await db.collection('users').doc(userId).update({
          subscription: {
            isPremium: true,
            plan: 'premium',
            status: 'active',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            startDate: now,
            expiryDate: expiryDate,
            paymentMethod: `**** ${paymentMethodId.slice(-4)}`,
          },
        });

        return res.json({
          status: 'success',
          subscriptionId: subscription.id,
          message: 'Subscription created successfully! Invoice sent to your email.',
        });
      }

      // Payment pending or failed
      res.json({
        status: paymentIntent.status || 'unknown',
        subscriptionId: subscription.id,
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      res.status(500).json({
        error: error.message || 'Failed to create subscription',
      });
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

      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const subscriptionId = userData?.subscription?.stripeSubscriptionId;

      if (!subscriptionId) {
        return res.status(400).json({ error: 'No active subscription found' });
      }

      // Cancel at period end (user keeps access until paid period ends)
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

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
      res.status(500).json({ error: 'Failed to cancel subscription' });
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
    // Verify webhook signature
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } else {
      // For testing without webhook signature verification
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
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
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);

        // Safely calculate expiry date
        const periodEnd = subscription.current_period_end;
        const expiryMillis = periodEnd ? periodEnd * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000);

        await userDoc.ref.update({
          'subscription.isPremium': true,
          'subscription.status': 'active',
          'subscription.expiryDate': admin.firestore.Timestamp.fromMillis(expiryMillis),
        });

        console.log(`Invoice paid for user ${userDoc.id}`);
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

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});
