// src/services/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDy4THJlI_fKQR0aXwBohDxkhkIzhqDJ1k",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "gestionturnos-7ec99.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "gestionturnos-7ec99",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "gestionturnos-7ec99.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "314406109434",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:314406109434:web:64fbf8f1f87d12b45c0943"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;