// src/contexts/DeliveryContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as firebaseService from '../services/firebaseService';

const DeliveryContext = createContext();

export const useDeliveryContext = () => {
  return useContext(DeliveryContext);
};

export const DeliveryProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [deliveryWork, setDeliveryWork] = useState([]);
  const [deliveryShifts, setDeliveryShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const unsubscribe = firebaseService.subscribeToDeliveryData(
        currentUser.uid,
        {
          setDeliveryWork,
          setDeliveryShifts,
          setError,
        }
      );
      
      // Data loads via snapshot, add delay to ensure first snapshot loads
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return () => {
        clearTimeout(timeoutId);
        unsubscribe();
      };
    } else {
      // Clear data if no user
      setDeliveryWork([]);
      setDeliveryShifts([]);
      setLoading(false);
    }
  }, [currentUser]);

  // CRUD functions for delivery work
  const addDeliveryJob = useCallback(async (newJob) => {
    if (!currentUser) throw new Error("Unauthenticated user");
    try {
      return await firebaseService.addJob(currentUser.uid, newJob, true);
    } catch (err) {
      setError('Error adding delivery work: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const editDeliveryJob = useCallback(async (id, updatedData) => {
    if (!currentUser) throw new Error("Unauthenticated user");
    try {
      await firebaseService.editJob(currentUser.uid, id, updatedData, true);
    } catch (err) {
      setError('Error editing delivery work: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const deleteDeliveryJob = useCallback(async (id) => {
    if (!currentUser) throw new Error("Unauthenticated user");
    try {
      await firebaseService.deleteJob(currentUser.uid, id, true);
    } catch (err) {
      setError('Error deleting delivery work: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  // CRUD functions for delivery shifts
  const addDeliveryShift = useCallback(async (newShift) => {
    if (!currentUser) throw new Error("Unauthenticated user");
    try {
      return await firebaseService.addShift(currentUser.uid, newShift, true);
    } catch (err) {
      setError('Error adding delivery shift: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const editDeliveryShift = useCallback(async (id, updatedData) => {
    if (!currentUser) throw new Error("Unauthenticated user");
    try {
      await firebaseService.editShift(currentUser.uid, id, updatedData, true);
    } catch (err) {
      setError('Error editing delivery shift: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const deleteDeliveryShift = useCallback(async (id) => {
    if (!currentUser) throw new Error("Unauthenticated user");
    try {
      await firebaseService.deleteShift(currentUser.uid, id, true);
    } catch (err) {
      setError('Error deleting delivery shift: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const value = {
    deliveryWork,
    deliveryShifts,
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
