// src/hooks/useTrabajosFirebase.js

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

const useTrabajosFirebase = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
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
      (snapshot) => {
        const trabajosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTrabajos(trabajosData);
        setCargando(false);
      },
      (err) => {
        setError(err.message);
        setCargando(false);
      }
    );
    
    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, []);
  
  return { trabajos, cargando, error };
};

export default useTrabajosFirebase;