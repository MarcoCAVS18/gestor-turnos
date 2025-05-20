import ***REMOVED*** initializeApp ***REMOVED*** from 'firebase/app';
import ***REMOVED*** getFirestore ***REMOVED*** from 'firebase/firestore';

// Configuración de tu Firebase
const firebaseConfig = ***REMOVED***
  apiKey: "REDACTED",
  authDomain: "gestionturnos-7ec99.firebaseapp.com",
  projectId: "gestionturnos-7ec99",
  storageBucket: "gestionturnos-7ec99.firebasestorage.app",
  messagingSenderId: "314406109434",
  appId: "1:314406109434:web:64fbf8f1f87d12b45c0943"
***REMOVED***;

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export ***REMOVED*** db ***REMOVED***;
