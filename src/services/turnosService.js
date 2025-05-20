// src/services/turnoService.js
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
  
  // Obtener todos los turnos de un usuario
  export const obtenerTurnos = async (userId) => ***REMOVED***
    try ***REMOVED***
      const turnosRef = collection(db, 'turnos');
      const q = query(
        turnosRef,
        where('userId', '==', userId),
        orderBy('fecha', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => (***REMOVED***
        id: doc.id,
        ...doc.data()
      ***REMOVED***));
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al obtener turnos:', error);
      throw error;
    ***REMOVED***
  ***REMOVED***;
  
  // Obtener turnos por rango de fechas
  export const obtenerTurnosPorRango = async (userId, fechaInicio, fechaFin) => ***REMOVED***
    try ***REMOVED***
      const turnosRef = collection(db, 'turnos');
      const q = query(
        turnosRef,
        where('userId', '==', userId),
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin),
        orderBy('fecha', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => (***REMOVED***
        id: doc.id,
        ...doc.data()
      ***REMOVED***));
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al obtener turnos por rango:', error);
      throw error;
    ***REMOVED***
  ***REMOVED***;
  
  // Obtener turnos por trabajo
  export const obtenerTurnosPorTrabajo = async (userId, trabajoId) => ***REMOVED***
    try ***REMOVED***
      const turnosRef = collection(db, 'turnos');
      const q = query(
        turnosRef,
        where('userId', '==', userId),
        where('trabajoId', '==', trabajoId),
        orderBy('fecha', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => (***REMOVED***
        id: doc.id,
        ...doc.data()
      ***REMOVED***));
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al obtener turnos por trabajo:', error);
      throw error;
    ***REMOVED***
  ***REMOVED***;
  
  // Guardar un nuevo turno
  export const guardarTurno = async (turno) => ***REMOVED***
    try ***REMOVED***
      // Agregar timestamp
      const turnoConTimestamp = ***REMOVED***
        ...turno,
        fechaCreacion: serverTimestamp()
      ***REMOVED***;
      
      const docRef = await addDoc(collection(db, 'turnos'), turnoConTimestamp);
      
      return ***REMOVED***
        id: docRef.id,
        ...turnoConTimestamp
      ***REMOVED***;
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar turno:', error);
      throw error;
    ***REMOVED***
  ***REMOVED***;
  
  // Actualizar un turno existente
  export const actualizarTurno = async (id, datos) => ***REMOVED***
    try ***REMOVED***
      const docRef = doc(db, 'turnos', id);
      await updateDoc(docRef, ***REMOVED***
        ...datos,
        fechaActualizacion: serverTimestamp()
      ***REMOVED***);
      
      return ***REMOVED***
        id,
        ...datos
      ***REMOVED***;
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al actualizar turno:', error);
      throw error;
    ***REMOVED***
  ***REMOVED***;
  
  // Eliminar un turno
  export const eliminarTurno = async (id) => ***REMOVED***
    try ***REMOVED***
      const docRef = doc(db, 'turnos', id);
      await deleteDoc(docRef);
      return true;
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al eliminar turno:', error);
      throw error;
    ***REMOVED***
  ***REMOVED***;