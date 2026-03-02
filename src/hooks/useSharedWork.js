// src/hooks/useSharedWork.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { useDataContext } from '../contexts/DataContext';
import { getSharedWork, acceptSharedWork } from '../services/shareService';

export const useSharedWork = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { reloadJobs } = useApp();
  const { isPremium } = usePremium();
  const { works } = useDataContext();
  
  const [sharedWork, setSharedWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const loadSharedWork = async () => {
      if (!token) {
        setError('Invalid link token');
        setLoading(false);
        return;
      }

      try {
        
        const data = await getSharedWork(token);
        
        setSharedWork(data);
      } catch (err) {
        setError(err.message || 'Error loading shared work');
      } finally {
        setLoading(false);
      }
    };

    loadSharedWork();
  }, [token]);

  const addWork = async () => {
    if (!sharedWork || !currentUser) {
      setError('No work to add or user not authenticated');
      return;
    }

    // Free users can only have 1 traditional work — enforce the limit on shared work acceptance
    const sharedWorkType = sharedWork?._rawData?.workData?.type || 'regular';
    if (sharedWorkType !== 'delivery' && !isPremium) {
      const traditionalCount = (works || []).filter(w => w.type !== 'delivery').length;
      if (traditionalCount >= 1) {
        setError('Free accounts can only have 1 traditional work. Upgrade to Premium to add more.');
        return;
      }
    }

    try {
      setAdding(true);
      setError('');

      // Use pre-fetched data to avoid duplicate Firestore read
      await acceptSharedWork(currentUser.uid, token, sharedWork?._rawData);
            
      // Navigate immediately, reload jobs in background
      navigate('/works');

      // Reload jobs in the context (don't block navigation)
      if (reloadJobs) {
        reloadJobs();
      }
      
    } catch (err) {
      setError('Error adding work: ' + err.message);
    } finally {
      setAdding(false);
    }
  };

  return {
    sharedWork: sharedWork?.workData,
    loading,
    error,
    adding,
    addWork,
    tokenInfo: sharedWork
  };
};