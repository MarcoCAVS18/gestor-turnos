// src/services/turnoService.js
import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  // Obtener todos los turnos de un usuario
  export const obtenerTurnos = async (userId) => {
    try {
      const turnosRef = collection(db, 'turnos');
      const q = query(
        turnosRef,
        where('userId', '==', userId),
        orderBy('fecha', 'desc')
      );
      
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
  export const obtenerTurnosPorRango = async (userId, fechaInicio, fechaFin) => {
    try {
      const turnosRef = collection(db, 'turnos');
      const q = query(
        turnosRef,
        where('userId', '==', userId),
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
  export const obtenerTurnosPorTrabajo = async (userId, trabajoId) => {
    try {
      const turnosRef = collection(db, 'turnos');
      const q = query(
        turnosRef,
        where('userId', '==', userId),
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
  
  // Guardar un nuevo turno
  export const guardarTurno = async (turno) => {
    try {
      // Agregar timestamp
      const turnoConTimestamp = {
        ...turno,
        fechaCreacion: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'turnos'), turnoConTimestamp);
      
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
      await updateDoc(docRef, {
        ...datos,
        fechaActualizacion: serverTimestamp()
      });
      
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