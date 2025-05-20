// src/services/trabajosService.js
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

// Referencia a la colección de trabajos
const trabajosRef = collection(db, 'trabajos');

// Obtener todos los trabajos
export const obtenerTrabajos = async () => {
  try {
    const q = query(trabajosRef, orderBy('nombre', 'asc'));
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

// Obtener un trabajo por su ID
export const obtenerTrabajoPorId = async (id) => {
  try {
    const docRef = doc(db, 'trabajos', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('El trabajo no existe');
    }
  } catch (error) {
    console.error('Error al obtener trabajo:', error);
    throw error;
  }
};

// Guardar un nuevo trabajo
export const guardarTrabajo = async (trabajo) => {
  try {
    // Agregar timestamp
    const trabajoConTimestamp = {
      ...trabajo,
      fechaCreacion: new Date()
    };
    
    const docRef = await addDoc(trabajosRef, trabajoConTimestamp);
    
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
    await updateDoc(docRef, datos);
    
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
