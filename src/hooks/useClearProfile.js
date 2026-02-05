// src/hooks/useClearProfile.js

import { useState, useCallback } from 'react';
import { clearUserData } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

export const useClearProfile = () => {
  const { currentUser } = useAuth();
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const clearProfile = useCallback(async () => {
    if (!currentUser?.uid) {
      setError('User not authenticated');
      return null;
    }

    setClearing(true);
    setError(null);
    setResult(null);

    try {
      const clearResult = await clearUserData(currentUser.uid);
      setResult(clearResult);
      return clearResult;
    } catch (err) {
      setError(err.message || 'Failed to clear profile data');
      throw err;
    } finally {
      setClearing(false);
    }
  }, [currentUser?.uid]);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return {
    clearing,
    error,
    result,
    clearProfile,
    reset,
  };
};

export default useClearProfile;
