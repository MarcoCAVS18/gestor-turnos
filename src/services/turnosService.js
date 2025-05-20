// src/services/turnosService.js
import ***REMOVED*** 
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
  ***REMOVED*** from 'firebase/firestore';
  import ***REMOVED*** db ***REMOVED*** from './firebase';
  
  // Referencia a la colección de turnos
  const turnosRef = collection(db, 'turnos');
  
  // Obtener todos los turnos
  export const obtenerTurnos = async () => ***REMOVED***
    try ***REMOVED***
      const q = query(turnosRef, orderBy('fecha', 'desc'));
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
  export const obtenerTurnosPorRango = async (fechaInicio, fechaFin) => ***REMOVED***
    try ***REMOVED***
      const q = query(
        turnosRef, 
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
  export const obtenerTurnosPorTrabajo = async (trabajoId) => ***REMOVED***
    try ***REMOVED***
      const q = query(
        turnosRef, 
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
  
  // Obtener un turno por su ID
  export const obtenerTurnoPorId = async (id) => ***REMOVED***
    try ***REMOVED***
      const docRef = doc(db, 'turnos', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) ***REMOVED***
        return ***REMOVED***
          id: docSnap.id,
          ...docSnap.data()
        ***REMOVED***;
      ***REMOVED*** else ***REMOVED***
        throw new Error('El turno no existe');
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al obtener turno:', error);
      throw error;
    ***REMOVED***
  ***REMOVED***;
  
  // Guardar un nuevo turno
  export const guardarTurno = async (turno) => ***REMOVED***
    try ***REMOVED***
      // Agregar timestamp
      const turnoConTimestamp = ***REMOVED***
        ...turno,
        fechaCreacion: new Date()
      ***REMOVED***;
      
      const docRef = await addDoc(turnosRef, turnoConTimestamp);
      
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
      await updateDoc(docRef, datos);
      
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