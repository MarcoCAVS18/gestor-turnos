// src/contexts/DataContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as firebaseService from '../services/firebaseService';

const DataContext = createContext();

export const useDataContext = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Translated state variables
  const [works, setWorks] = useState([]); // Was: trabajos / setTrabajos
  const [shifts, setShifts] = useState([]); // Was: turnos / setTurnos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      
      // WARNING: Make sure your firebaseService.subscribeToNormalData 
      // is updated to accept these new key names (setWorks, setShifts)
      const unsubscribe = firebaseService.subscribeToNormalData(
        currentUser.uid,
        {
          setWorks, // Was: setTrabajos
          setShifts, // Was: setTurnos
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
      setWorks([]);
      setShifts([]);
      setLoading(false);
    }
  }, [currentUser]);

  // CRUD functions for traditional jobs
  const addJob = useCallback(async (newJob) => {
    if (!currentUser) throw new Error("User not authenticated");
    try {
      return await firebaseService.addJob(currentUser.uid, newJob);
    } catch (err) {
      setError('Error adding job: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const editJob = useCallback(async (id, updatedData) => {
    if (!currentUser) throw new Error("User not authenticated");
    try {
      await firebaseService.editJob(currentUser.uid, id, updatedData);
    } catch (err) {
      setError('Error editing job: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const deleteJob = useCallback(async (id) => {
    if (!currentUser) throw new Error("User not authenticated");
    try {
      await firebaseService.deleteJob(currentUser.uid, id);
    } catch (err) {
      setError('Error deleting job: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  // CRUD functions for traditional shifts
  const addShift = useCallback(async (newShift) => {
    if (!currentUser) throw new Error("User not authenticated");
    try {
      return await firebaseService.addShift(currentUser.uid, newShift);
    } catch (err) {
      setError('Error adding shift: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const editShift = useCallback(async (id, updatedData) => {
    if (!currentUser) throw new Error("User not authenticated");
    try {
      await firebaseService.editShift(currentUser.uid, id, updatedData);
    } catch (err) {
      setError('Error editing shift: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const deleteShift = useCallback(async (id) => {
    if (!currentUser) throw new Error("User not authenticated");
    try {
      await firebaseService.deleteShift(currentUser.uid, id);
    } catch (err) {
      setError('Error deleting shift: ' + err.message);
      throw err;
    }
  }, [currentUser]);

  const value = {
    works, // Exported as 'works' to match AppContext expectation
    shifts, // Exported as 'shifts'
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
