// src/services/trabajosService.js
import ***REMOVED*** 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** db ***REMOVED*** from './firebase';

// Referencia a la colección de trabajos
const trabajosRef = collection(db, 'trabajos');

// Obtener todos los trabajos
export const obtenerTrabajos = async () => ***REMOVED***
  try ***REMOVED***
    const q = query(trabajosRef, orderBy('nombre', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => (***REMOVED***
      id: doc.id,
      ...doc.data()
    ***REMOVED***));
  ***REMOVED*** catch (error) ***REMOVED***
    console.error('Error al obtener trabajos:', error);
    throw error;
  ***REMOVED***
***REMOVED***;

// Obtener un trabajo por su ID
export const obtenerTrabajoPorId = async (id) => ***REMOVED***
  try ***REMOVED***
    const docRef = doc(db, 'trabajos', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) ***REMOVED***
      return ***REMOVED***
        id: docSnap.id,
        ...docSnap.data()
      ***REMOVED***;
    ***REMOVED*** else ***REMOVED***
      throw new Error('El trabajo no existe');
    ***REMOVED***
  ***REMOVED*** catch (error) ***REMOVED***
    console.error('Error al obtener trabajo:', error);
    throw error;
  ***REMOVED***
***REMOVED***;

// Guardar un nuevo trabajo
export const guardarTrabajo = async (trabajo) => ***REMOVED***
  try ***REMOVED***
    // Agregar timestamp
    const trabajoConTimestamp = ***REMOVED***
      ...trabajo,
      fechaCreacion: new Date()
    ***REMOVED***;
    
    const docRef = await addDoc(trabajosRef, trabajoConTimestamp);
    
    return ***REMOVED***
      id: docRef.id,
      ...trabajoConTimestamp
    ***REMOVED***;
  ***REMOVED*** catch (error) ***REMOVED***
    console.error('Error al guardar trabajo:', error);
    throw error;
  ***REMOVED***
***REMOVED***;

// Actualizar un trabajo existente
export const actualizarTrabajo = async (id, datos) => ***REMOVED***
  try ***REMOVED***
    const docRef = doc(db, 'trabajos', id);
    await updateDoc(docRef, datos);
    
    return ***REMOVED***
      id,
      ...datos
    ***REMOVED***;
  ***REMOVED*** catch (error) ***REMOVED***
    console.error('Error al actualizar trabajo:', error);
    throw error;
  ***REMOVED***
***REMOVED***;

// Eliminar un trabajo
export const eliminarTrabajo = async (id) => ***REMOVED***
  try ***REMOVED***
    const docRef = doc(db, 'trabajos', id);
    await deleteDoc(docRef);
    return true;
  ***REMOVED*** catch (error) ***REMOVED***
    console.error('Error al eliminar trabajo:', error);
    throw error;
  ***REMOVED***
***REMOVED***;
