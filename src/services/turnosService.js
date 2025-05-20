// src/services/turnosService.js
import { 
    collection, 
    addDoc, 
    doc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    where 
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  // Referencia a la colección de turnos
  const turnosRef = collection(db, 'turnos');
  
  // Obtener todos los turnos
  export const obtenerTurnos = async () => {
    try {
      const q = query(turnosRef, orderBy('fecha', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener turnos:', error);
      throw error;
    }
  };
  
  // Obtener turnos por rango de fechas
  export const obtenerTurnosPorRango = async (fechaInicio, fechaFin) => {
    try {
      const q = query(
        turnosRef, 
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin),
        orderBy('fecha', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener turnos por rango:', error);
      throw error;
    }
  };
  
  // Obtener turnos por trabajo
  export const obtenerTurnosPorTrabajo = async (trabajoId) => {
    try {
      const q = query(
        turnosRef, 
        where('trabajoId', '==', trabajoId),
        orderBy('fecha', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener turnos por trabajo:', error);
      throw error;
    }
  };
  
  // Obtener un turno por su ID
  export const obtenerTurnoPorId = async (id) => {
    try {
      const docRef = doc(db, 'turnos', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('El turno no existe');
      }
    } catch (error) {
      console.error('Error al obtener turno:', error);
      throw error;
    }
  };
  
  // Guardar un nuevo turno
  export const guardarTurno = async (turno) => {
    try {
      // Agregar timestamp
      const turnoConTimestamp = {
        ...turno,
        fechaCreacion: new Date()
      };
      
      const docRef = await addDoc(turnosRef, turnoConTimestamp);
      
      return {
        id: docRef.id,
        ...turnoConTimestamp
      };
    } catch (error) {
      console.error('Error al guardar turno:', error);
      throw error;
    }
  };
  
  // Actualizar un turno existente
  export const actualizarTurno = async (id, datos) => {
    try {
      const docRef = doc(db, 'turnos', id);
      await updateDoc(docRef, datos);
      
      return {
        id,
        ...datos
      };
    } catch (error) {
      console.error('Error al actualizar turno:', error);
      throw error;
    }
  };
  
  // Eliminar un turno
  export const eliminarTurno = async (id) => {
    try {
      const docRef = doc(db, 'turnos', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      throw error;
    }
  };