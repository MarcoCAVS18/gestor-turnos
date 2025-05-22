// src/hooks/useTurnosFirebase.js

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

const useTurnosFirebase = (fechaInicio, fechaFin) => {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setCargando(true);
    
    // Crear query para obtener turnos ordenados por fecha descendente
    const turnosRef = collection(db, 'turnos');
    let turnosQuery;
    
    if (fechaInicio && fechaFin) {
      // Si se especifica un rango de fechas, filtrar por ese rango
      turnosQuery = query(
        turnosRef,
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin),
        orderBy('fecha', 'desc')
      );
    } else {
      // Si no, obtener todos los turnos
      turnosQuery = query(
        turnosRef,
        orderBy('fecha', 'desc')
      );
    }
    
    // Suscripción a cambios en tiempo real
    const unsubscribe = onSnapshot(
      turnosQuery,
      (snapshot) => {
        const turnosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTurnos(turnosData);
        setCargando(false);
      },
      (err) => {
        setError(err.message);
        setCargando(false);
      }
    );
    
    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, [fechaInicio, fechaFin]);
  
  return { turnos, cargando, error };
};

export default useTurnosFirebase;