// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración corregida de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDy4THJlI_fKQR0aXwBohDxkhkIzhqDJ1k",
  authDomain: "gestionturnos-7ec99.firebaseapp.com",
  projectId: "gestionturnos-7ec99",
  storageBucket: "gestionturnos-7ec99.appspot.com",
  messagingSenderId: "314406109434",
  appId: "1:314406109434:web:64fbf8f1f87d12b45c0943"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;