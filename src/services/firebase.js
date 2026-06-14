// src/services/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, initializeAuth, indexedDBLocalPersistence, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { Capacitor } from '@capacitor/core';

// Firebase configuration from environment variables only
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase, Firestore, Auth and Storage
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// On native (iOS/Android), use initializeAuth with indexedDBLocalPersistence to prevent
// Firebase from loading the browser popup/redirect resolver (gapi.js), which is
// incompatible with WKWebView and causes blank screen + CORS errors.
// On web, getAuth() is used as-is — no change to web behavior.
const auth = Capacitor.isNativePlatform()
  ? initializeAuth(app, { persistence: indexedDBLocalPersistence })
  : getAuth(app);

const storage = getStorage(app);
const functions = getFunctions(app, 'us-central1');

// Local development: route everything to the Firebase Emulator Suite so the app
// never touches production data. Enabled by REACT_APP_USE_EMULATOR=true (set by
// the `dev` npm script). Web only — native devices can't reach the host's
// localhost. See firebase.json "emulators" and `npm run dev` / `npm run seed`.
if (process.env.REACT_APP_USE_EMULATOR === 'true' && !Capacitor.isNativePlatform()) {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  // eslint-disable-next-line no-console
  console.info('%c[firebase] Using local emulators (Auth · Firestore · Storage · Functions)', 'color:#6366F1;font-weight:bold');
}

export { db, auth, storage, functions };
export default app;