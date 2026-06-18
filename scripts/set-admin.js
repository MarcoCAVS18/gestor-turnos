// scripts/set-admin.js
//
// Grants (or revokes) the `admin` custom claim for a user, which unlocks the
// admin panel (/admin). Custom claims live in the auth token and cannot be set
// or forged from the client — only via the Admin SDK, like this.
//
// Usage:
//   node scripts/set-admin.js <email>            # grant admin
//   node scripts/set-admin.js <email> --revoke   # revoke admin
//
// Targets the local Auth emulator by default. To target PRODUCTION, set
// GOOGLE_APPLICATION_CREDENTIALS to a service-account key and unset the
// emulator host:
//   FIREBASE_AUTH_EMULATOR_HOST= GOOGLE_APPLICATION_CREDENTIALS=./sa.json \
//     node scripts/set-admin.js you@example.com

const fs = require('fs');
const path = require('path');

const email = process.argv[2];
const revoke = process.argv.includes('--revoke');

if (!email) {
  console.error('Usage: node scripts/set-admin.js <email> [--revoke]');
  process.exit(1);
}

const usingProd = !!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIREBASE_AUTH_EMULATOR_HOST;
if (!usingProd && !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  // Default to the local emulator unless prod credentials were provided.
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
}

const admin = require('firebase-admin');
const projectId = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '.firebaserc'), 'utf8')).projects.default;
admin.initializeApp({ projectId });

(async () => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, revoke ? { admin: false } : { admin: true });
    console.log(`${revoke ? '🚫 Revoked' : '✅ Granted'} admin for ${email} (${user.uid}) on ${usingProd ? 'PRODUCTION' : 'emulator'}`);
    console.log('Note: the user must sign out and back in for the new claim to take effect.');
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
})();
