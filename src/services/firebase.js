// src/services/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
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

export { db, auth, storage };
export default app;