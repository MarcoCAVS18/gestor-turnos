// src/contexts/DeliveryContext.jsx

import React, ***REMOVED*** createContext, useContext, useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** useAuth ***REMOVED*** from './AuthContext';
import * as firebaseService from '../services/firebaseService';

const DeliveryContext = createContext();

export const useDeliveryContext = () => ***REMOVED***
  return useContext(DeliveryContext);
***REMOVED***;

export const DeliveryProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();

  const [deliveryWork, setDeliveryWork] = useState([]);
  const [deliveryShifts, setDeliveryShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => ***REMOVED***
    if (currentUser) ***REMOVED***
      setLoading(true);
      const unsubscribe = firebaseService.subscribeToDeliveryData(
        currentUser.uid,
        ***REMOVED***
          setDeliveryWork,
          setDeliveryShifts,
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
      setDeliveryWork([]);
      setDeliveryShifts([]);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // CRUD functions for delivery work
  const addDeliveryJob = useCallback(async (newJob) => ***REMOVED***
    if (!currentUser) throw new Error("Unauthenticated user");
    try ***REMOVED***
      return await firebaseService.addJob(currentUser.uid, newJob, true);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error adding delivery work: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const editDeliveryJob = useCallback(async (id, updatedData) => ***REMOVED***
    if (!currentUser) throw new Error("Unauthenticated user");
    try ***REMOVED***
      await firebaseService.editJob(currentUser.uid, id, updatedData, true);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error editing delivery work: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const deleteDeliveryJob = useCallback(async (id) => ***REMOVED***
    if (!currentUser) throw new Error("Unauthenticated user");
    try ***REMOVED***
      await firebaseService.deleteJob(currentUser.uid, id, true);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error deleting delivery work: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  // CRUD functions for delivery shifts
  const addDeliveryShift = useCallback(async (newShift) => ***REMOVED***
    if (!currentUser) throw new Error("Unauthenticated user");
    try ***REMOVED***
      return await firebaseService.addShift(currentUser.uid, newShift, true);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error adding delivery shift: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const editDeliveryShift = useCallback(async (id, updatedData) => ***REMOVED***
    if (!currentUser) throw new Error("Unauthenticated user");
    try ***REMOVED***
      await firebaseService.editShift(currentUser.uid, id, updatedData, true);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error editing delivery shift: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const deleteDeliveryShift = useCallback(async (id) => ***REMOVED***
    if (!currentUser) throw new Error("Unauthenticated user");
    try ***REMOVED***
      await firebaseService.deleteShift(currentUser.uid, id, true);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error deleting delivery shift: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***, [currentUser]);

  const value = ***REMOVED***
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
  ***REMOVED***;

  return <DeliveryContext.Provider value=***REMOVED***value***REMOVED***>***REMOVED***children***REMOVED***</DeliveryContext.Provider>;
***REMOVED***;
