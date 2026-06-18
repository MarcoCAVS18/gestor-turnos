// scripts/seed-emulators.js
//
// Seeds the local Firebase Emulator Suite with a ready-to-use test account.
// Uses the Admin SDK, which bypasses Firestore security rules — this is the
// ONLY way to set subscription.isPremium = true, because the rules deliberately
// block clients from doing it (see firestore.rules). That protection is exactly
// why a normal client can't self-grant Premium.
//
// Prerequisites: emulators running (`npm run dev`, or `npm run dev:emulators`).
// Run with: `npm run seed`
//
// Login afterwards with the credentials printed at the end.

// Point the Admin SDK at the emulators (must be set before requiring firebase-admin).
process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// .firebaserc is JSON but has no .json extension, so read + parse it explicitly.
const firebaserc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '.firebaserc'), 'utf8'));
const projectId = firebaserc.projects.default;

admin.initializeApp({ projectId });

const auth = admin.auth();
const db = admin.firestore();

const TEST_EMAIL = 'premium@test.local';
const TEST_PASSWORD = 'test1234';
const TEST_NAME = 'Premium Tester';

async function ensureUser() {
  try {
    const user = await auth.getUserByEmail(TEST_EMAIL);
    console.log('• User already exists:', user.uid);
    return user;
  } catch {
    const user = await auth.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      displayName: TEST_NAME,
      emailVerified: true,
    });
    console.log('• Created user:', user.uid);
    return user;
  }
}

async function grantPremium(uid) {
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);

  await db.collection('users').doc(uid).set(
    {
      email: TEST_EMAIL,
      displayName: TEST_NAME,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      subscription: {
        isPremium: true,
        plan: 'premium',
        status: 'active',
        stripeCustomerId: 'cus_emulator_test',
        stripeSubscriptionId: 'sub_emulator_test',
        expiryDate: admin.firestore.Timestamp.fromDate(expiry),
      },
    },
    { merge: true }
  );
  console.log('• Premium granted until', expiry.toISOString().slice(0, 10));
}

async function grantAdmin(uid) {
  await auth.setCustomUserClaims(uid, { admin: true });
  console.log('• Admin custom claim set');
}

(async () => {
  try {
    const user = await ensureUser();
    await grantPremium(user.uid);
    await grantAdmin(user.uid);
    console.log('\n✅ Seed complete.');
    console.log('   Email:    ' + TEST_EMAIL);
    console.log('   Password: ' + TEST_PASSWORD);
    console.log('   Emulator UI: http://127.0.0.1:4000\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed. Are the emulators running? (npm run dev)\n', err);
    process.exit(1);
  }
})();
