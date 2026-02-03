// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const cors = require('cors')({ origin: true });
require('dotenv').config();

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
    res.redirect(`${appUrl}/integraciones?calendar=connected`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    const appUrl = process.env.APP_URL || 'https://gestionturnos-7ec99.web.app';
    res.redirect(`${appUrl}/integraciones?calendar=error`);
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
