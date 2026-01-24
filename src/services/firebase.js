// src/services/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDy4THJlI_fKQR0aXwBohDxkhkIzhqDJ1k",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "gestionturnos-7ec99.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "gestionturnos-7ec99",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "gestionturnos-7ec99.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "314406109434",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:314406109434:web:64fbf8f1f87d12b45c0943"
};

// Initialize Firebase, Firestore, Auth and Storage
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
export default app;