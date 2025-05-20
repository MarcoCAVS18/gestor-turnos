// src/services/trabajoService.js
import ***REMOVED*** 
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
  ***REMOVED*** from 'firebase/firestore';
  import ***REMOVED*** db ***REMOVED*** from './firebase';
  
  // Obtener todos los trabajos de un usuario
  export const obtenerTrabajos = async (userId) => ***REMOVED***
    try ***REMOVED***
      const trabajosRef = collection(db, 'trabajos');
      const q = query(
        trabajosRef,
        where('userId', '==', userId),
        orderBy('nombre', 'asc')
      );
      
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
  
  // Guardar un nuevo trabajo
  export const guardarTrabajo = async (trabajo) => ***REMOVED***
    try ***REMOVED***
      // Agregar timestamp
      const trabajoConTimestamp = ***REMOVED***
        ...trabajo,
        fechaCreacion: serverTimestamp()
      ***REMOVED***;
      
      const docRef = await addDoc(collection(db, 'trabajos'), trabajoConTimestamp);
      
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
      await updateDoc(docRef, ***REMOVED***
        ...datos,
        fechaActualizacion: serverTimestamp()
      ***REMOVED***);
      
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