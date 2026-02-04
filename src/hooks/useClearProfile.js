// src/hooks/useClearProfile.js

import { useState, useCallback } from 'react';
import { clearUserData } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

export const useClearProfile = () => {
  const { user } = useAuth();
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const clearProfile = useCallback(async () => {
    if (!user?.uid) {
      setError('User not authenticated');
      return null;
    }

    setClearing(true);
    setError(null);
    setResult(null);

    try {
      const clearResult = await clearUserData(user.uid);
      setResult(clearResult);
      return clearResult;
    } catch (err) {
      console.error('Error clearing profile:', err);
      setError(err.message || 'Failed to clear profile data');
      throw err;
    } finally {
      setClearing(false);
    }
  }, [user?.uid]);

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
