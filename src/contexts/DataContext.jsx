// src/contexts/DataContext.jsx

import React, ***REMOVED*** createContext, useContext, useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** useAuth ***REMOVED*** from './AuthContext';
import * as firebaseService from '../services/firebaseService';

const DataContext = createContext();

export const useDataContext = () => ***REMOVED***
  return useContext(DataContext);
***REMOVED***;

export const DataProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();

  // Translated state variables
  const [works, setWorks] = useState([]); // Was: trabajos / setTrabajos
  const [shifts, setShifts] = useState([]); // Was: turnos / setTurnos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => ***REMOVED***
    if (currentUser) ***REMOVED***
      setLoading(true);
      
      // WARNING: Make sure your firebaseService.subscribeToNormalData 
      // is updated to accept these new key names (setWorks, setShifts)
      const unsubscribe = firebaseService.subscribeToNormalData(
        currentUser.uid,
        ***REMOVED***
          setWorks, // Was: setTrabajos
          setShifts, // Was: setTurnos
          setError,
        ***REMOVED***
      );
      
      // Data loads via snapshot, add delay to ensure first snapshot loads
      const timeoutId = setTimeout(() => ***REMOVED***
        setLoading(false);
      ***REMOVED***, 1000);
      
      return () => ***REMOVED***
        clearTimeout(timeoutId);
        unsubscribe();
      ***REMOVED***;
    ***REMOVED*** else ***REMOVED***
      // Clear data if no user
      setWorks([]);
      setShifts([]);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // CRUD functions for traditional jobs
  const addJob = useCallback(async (newJob) => ***REMOVED***
    if (!currentUser) throw new Error("User not authenticated");
    try ***REMOVED***
      return await firebaseService.addJob(currentUser.uid, newJob);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error adding job: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const editJob = useCallback(async (id, updatedData) => ***REMOVED***
    if (!currentUser) throw new Error("User not authenticated");
    try ***REMOVED***
      await firebaseService.editJob(currentUser.uid, id, updatedData);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error editing job: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const deleteJob = useCallback(async (id) => ***REMOVED***
    if (!currentUser) throw new Error("User not authenticated");
    try ***REMOVED***
      await firebaseService.deleteJob(currentUser.uid, id);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error deleting job: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // CRUD functions for traditional shifts
  const addShift = useCallback(async (newShift) => ***REMOVED***
    if (!currentUser) throw new Error("User not authenticated");
    try ***REMOVED***
      return await firebaseService.addShift(currentUser.uid, newShift);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error adding shift: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const editShift = useCallback(async (id, updatedData) => ***REMOVED***
    if (!currentUser) throw new Error("User not authenticated");
    try ***REMOVED***
      await firebaseService.editShift(currentUser.uid, id, updatedData);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error editing shift: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const deleteShift = useCallback(async (id) => ***REMOVED***
    if (!currentUser) throw new Error("User not authenticated");
    try ***REMOVED***
      await firebaseService.deleteShift(currentUser.uid, id);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error deleting shift: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const value = ***REMOVED***
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
  ***REMOVED***;

  return <DataContext.Provider value=***REMOVED***value***REMOVED***>***REMOVED***children***REMOVED***</DataContext.Provider>;
***REMOVED***;
