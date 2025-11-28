import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as firebaseService from '../services/firebaseService';

const DeliveryContext = createContext();

export const useDeliveryContext = () => {
  return useContext(DeliveryContext);
};

export const DeliveryProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [trabajosDelivery, setTrabajosDelivery] = useState([]);
  const [turnosDelivery, setTurnosDelivery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const unsubscribe = firebaseService.subscribeToDeliveryData(
        currentUser.uid,
        {
          setTrabajosDelivery,
          setTurnosDelivery,
          setError,
        }
      );
      setLoading(false); // Datos se cargan via snapshot
      return () => unsubscribe();
    } else {
      // Limpiar datos si no hay usuario
      setTrabajosDelivery([]);
      setTurnosDelivery([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Funciones CRUD para trabajos de delivery
  const addDeliveryJob = useCallback(async (newJob) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      return await firebaseService.addDeliveryJob(currentUser.uid, newJob);
    } catch (err) {
      setError('Error al agregar trabajo de delivery: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const editDeliveryJob = useCallback(async (id, updatedData) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      await firebaseService.editDeliveryJob(currentUser.uid, id, updatedData);
    } catch (err) {
      setError('Error al editar trabajo de delivery: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const deleteDeliveryJob = useCallback(async (id) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      await firebaseService.deleteDeliveryJob(currentUser.uid, id);
    } catch (err) {
      setError('Error al eliminar trabajo de delivery: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  // Funciones CRUD para turnos de delivery
  const addDeliveryShift = useCallback(async (newShift) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      return await firebaseService.addDeliveryShift(currentUser.uid, newShift);
    } catch (err) {
      setError('Error al agregar turno de delivery: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const editDeliveryShift = useCallback(async (id, updatedData) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      await firebaseService.editDeliveryShift(currentUser.uid, id, updatedData);
    } catch (err) {
      setError('Error al editar turno de delivery: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const deleteDeliveryShift = useCallback(async (id) => {
    if (!currentUser) throw new Error("Usuario no autenticado");
    try {
      await firebaseService.deleteDeliveryShift(currentUser.uid, id);
    } catch (err) {
      setError('Error al eliminar turno de delivery: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const value = {
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
  };

  return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
};