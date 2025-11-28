import React, ***REMOVED*** createContext, useContext, useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** useAuth ***REMOVED*** from './AuthContext';
import * as firebaseService from '../services/firebaseService';

const DeliveryContext = createContext();

export const useDeliveryContext = () => ***REMOVED***
  return useContext(DeliveryContext);
***REMOVED***;

export const DeliveryProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();

  const [trabajosDelivery, setTrabajosDelivery] = useState([]);
  const [turnosDelivery, setTurnosDelivery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => ***REMOVED***
    if (currentUser) ***REMOVED***
      setLoading(true);
      const unsubscribe = firebaseService.subscribeToDeliveryData(
        currentUser.uid,
        ***REMOVED***
          setTrabajosDelivery,
          setTurnosDelivery,
          setError,
        ***REMOVED***
      );
      setLoading(false); // Datos se cargan via snapshot
      return () => unsubscribe();
    ***REMOVED*** else ***REMOVED***
      // Limpiar datos si no hay usuario
      setTrabajosDelivery([]);
      setTurnosDelivery([]);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // Funciones CRUD para trabajos de delivery
  const addDeliveryJob = useCallback(async (newJob) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      return await firebaseService.addDeliveryJob(currentUser.uid, newJob);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al agregar trabajo de delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const editDeliveryJob = useCallback(async (id, updatedData) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      await firebaseService.editDeliveryJob(currentUser.uid, id, updatedData);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al editar trabajo de delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const deleteDeliveryJob = useCallback(async (id) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      await firebaseService.deleteDeliveryJob(currentUser.uid, id);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al eliminar trabajo de delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // Funciones CRUD para turnos de delivery
  const addDeliveryShift = useCallback(async (newShift) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      return await firebaseService.addDeliveryShift(currentUser.uid, newShift);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al agregar turno de delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const editDeliveryShift = useCallback(async (id, updatedData) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      await firebaseService.editDeliveryShift(currentUser.uid, id, updatedData);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al editar turno de delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const deleteDeliveryShift = useCallback(async (id) => ***REMOVED***
    if (!currentUser) throw new Error("Usuario no autenticado");
    try ***REMOVED***
      await firebaseService.deleteDeliveryShift(currentUser.uid, id);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al eliminar turno de delivery: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const value = ***REMOVED***
    trabajosDelivery,
    turnosDelivery,
    loading,
    error,
    addDeliveryJob,
    editDeliveryJob,
    deleteDeliveryJob,
    addDeliveryShift,
    editDeliveryShift,
    deleteDeliveryShift,
  ***REMOVED***;

  return <DeliveryContext.Provider value=***REMOVED***value***REMOVED***>***REMOVED***children***REMOVED***</DeliveryContext.Provider>;
***REMOVED***;