// src/services/trabajoService.js

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
  
  // Obtener todos los trabajos de un usuario
  export const obtenerTrabajos = async (userId) => {
    try {
      const trabajosRef = collection(db, 'trabajos');
      const q = query(
        trabajosRef,
        where('userId', '==', userId),
        orderBy('nombre', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener trabajos:', error);
      throw error;
    }
  };
  
  // Guardar un nuevo trabajo
  export const guardarTrabajo = async (trabajo) => {
    try {
      // Agregar timestamp
      const trabajoConTimestamp = {
        ...trabajo,
        fechaCreacion: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'trabajos'), trabajoConTimestamp);
      
      return {
        id: docRef.id,
        ...trabajoConTimestamp
      };
    } catch (error) {
      console.error('Error al guardar trabajo:', error);
      throw error;
    }
  };
  
  // Actualizar un trabajo existente
  export const actualizarTrabajo = async (id, datos) => {
    try {
      const docRef = doc(db, 'trabajos', id);
      await updateDoc(docRef, {
        ...datos,
        fechaActualizacion: serverTimestamp()
      });
      
      return {
        id,
        ...datos
      };
    } catch (error) {
      console.error('Error al actualizar trabajo:', error);
      throw error;
    }
  };
  
  // Eliminar un trabajo
  export const eliminarTrabajo = async (id) => {
    try {
      const docRef = doc(db, 'trabajos', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error al eliminar trabajo:', error);
      throw error;
    }
  };