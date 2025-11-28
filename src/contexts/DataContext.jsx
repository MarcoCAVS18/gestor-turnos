import React, ***REMOVED*** createContext, useContext, useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** useAuth ***REMOVED*** from './AuthContext';
import * as firebaseService from '../services/firebaseService';

const DataContext = createContext();

export const useDataContext = () => ***REMOVED***
  return useContext(DataContext);
***REMOVED***;

export const DataProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();

  const [trabajos, setTrabajos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => ***REMOVED***
    if (currentUser) ***REMOVED***
      setLoading(true);
      const unsubscribe = firebaseService.subscribeToNormalData(
        currentUser.uid,
        ***REMOVED***
          setTrabajos,
          setTurnos,
          setError,
        ***REMOVED***
      );
      setLoading(false); // Datos se cargan via snapshot, podemos quitar el loading inicial
      return () => unsubscribe();
    ***REMOVED*** else ***REMOVED***
      // Limpiar datos si no hay usuario
      setTrabajos([]);
      setTurnos([]);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // Funciones CRUD para trabajos tradicionales
  const addJob = useCallback(async (newJob) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      return await firebaseService.addJob(currentUser.uid, newJob);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al agregar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const editJob = useCallback(async (id, updatedData) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      await firebaseService.editJob(currentUser.uid, id, updatedData);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al editar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const deleteJob = useCallback(async (id) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      await firebaseService.deleteJob(currentUser.uid, id);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al eliminar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // Funciones CRUD para turnos tradicionales
  const addShift = useCallback(async (newShift) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      return await firebaseService.addShift(currentUser.uid, newShift);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al guardar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const editShift = useCallback(async (id, updatedData) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      await firebaseService.editShift(currentUser.uid, id, updatedData);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al editar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const deleteShift = useCallback(async (id) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      await firebaseService.deleteShift(currentUser.uid, id);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const value = ***REMOVED***
    trabajos,
    turnos,
    loading,
    error,
    addJob,
    editJob,
    deleteJob,
    addShift,
    editShift,
    deleteShift,
  ***REMOVED***;

  return <DataContext.Provider value=***REMOVED***value***REMOVED***>***REMOVED***children***REMOVED***</DataContext.Provider>;
***REMOVED***;