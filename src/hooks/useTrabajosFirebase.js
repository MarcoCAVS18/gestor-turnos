// src/hooks/useTrabajosFirebase.js
import ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** collection, query, onSnapshot, where, orderBy ***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** db ***REMOVED*** from '../services/firebase';

const useTrabajosFirebase = () => ***REMOVED***
  const [trabajos, setTrabajos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => ***REMOVED***
    setCargando(true);
    
    // Crear query para obtener trabajos ordenados por nombre
    const trabajosRef = collection(db, 'trabajos');
    const trabajosQuery = query(
      trabajosRef,
      orderBy('nombre', 'asc')
    );
    
    // Suscripción a cambios en tiempo real
    const unsubscribe = onSnapshot(
      trabajosQuery,
      (snapshot) => ***REMOVED***
        const trabajosData = snapshot.docs.map(doc => (***REMOVED***
          id: doc.id,
          ...doc.data()
        ***REMOVED***));
        
        setTrabajos(trabajosData);
        setCargando(false);
      ***REMOVED***,
      (err) => ***REMOVED***
        setError(err.message);
        setCargando(false);
      ***REMOVED***
    );
    
    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  ***REMOVED***, []);
  
  return ***REMOVED*** trabajos, cargando, error ***REMOVED***;
***REMOVED***;

export default useTrabajosFirebase;