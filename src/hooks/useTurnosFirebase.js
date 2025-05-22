// src/hooks/useTurnosFirebase.js

import ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** collection, query, onSnapshot, orderBy ***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** db ***REMOVED*** from '../services/firebase';

const useTurnosFirebase = (fechaInicio, fechaFin) => ***REMOVED***
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => ***REMOVED***
    setCargando(true);
    
    // Crear query para obtener turnos ordenados por fecha descendente
    const turnosRef = collection(db, 'turnos');
    let turnosQuery;
    
    if (fechaInicio && fechaFin) ***REMOVED***
      // Si se especifica un rango de fechas, filtrar por ese rango
      turnosQuery = query(
        turnosRef,
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin),
        orderBy('fecha', 'desc')
      );
    ***REMOVED*** else ***REMOVED***
      // Si no, obtener todos los turnos
      turnosQuery = query(
        turnosRef,
        orderBy('fecha', 'desc')
      );
    ***REMOVED***
    
    // Suscripción a cambios en tiempo real
    const unsubscribe = onSnapshot(
      turnosQuery,
      (snapshot) => ***REMOVED***
        const turnosData = snapshot.docs.map(doc => (***REMOVED***
          id: doc.id,
          ...doc.data()
        ***REMOVED***));
        
        setTurnos(turnosData);
        setCargando(false);
      ***REMOVED***,
      (err) => ***REMOVED***
        setError(err.message);
        setCargando(false);
      ***REMOVED***
    );
    
    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  ***REMOVED***, [fechaInicio, fechaFin]);
  
  return ***REMOVED*** turnos, cargando, error ***REMOVED***;
***REMOVED***;

export default useTurnosFirebase;