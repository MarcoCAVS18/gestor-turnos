import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as firebaseService from '../services/firebaseService';

const DataContext = createContext();

export const useDataContext = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [trabajos, setTrabajos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const unsubscribe = firebaseService.subscribeToNormalData(
        currentUser.uid,
        {
          setTrabajos,
          setTurnos,
          setError,
        }
      );
      setLoading(false); // Datos se cargan via snapshot, podemos quitar el loading inicial
      return () => unsubscribe();
    } else {
      // Limpiar datos si no hay usuario
      setTrabajos([]);
      setTurnos([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Funciones CRUD para trabajos tradicionales
  const addJob = useCallback(async (newJob) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      return await firebaseService.addJob(currentUser.uid, newJob);
    } catch (err) {
      setError('Error al agregar trabajo: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const editJob = useCallback(async (id, updatedData) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      await firebaseService.editJob(currentUser.uid, id, updatedData);
    } catch (err) {
      setError('Error al editar trabajo: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const deleteJob = useCallback(async (id) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      await firebaseService.deleteJob(currentUser.uid, id);
    } catch (err) {
      setError('Error al eliminar trabajo: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  // Funciones CRUD para turnos tradicionales
  const addShift = useCallback(async (newShift) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      return await firebaseService.addShift(currentUser.uid, newShift);
    } catch (err) {
      setError('Error al guardar turno: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const editShift = useCallback(async (id, updatedData) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      await firebaseService.editShift(currentUser.uid, id, updatedData);
    } catch (err) {
      setError('Error al editar turno: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const deleteShift = useCallback(async (id) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      await firebaseService.deleteShift(currentUser.uid, id);
    } catch (err) {
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const value = {
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
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};