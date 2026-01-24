// src/hooks/useSharedWork.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { getSharedWork, acceptSharedWork } from '../services/shareService';

export const useSharedWork = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { reloadJobs } = useApp(); 
  
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
    
    try {
      setAdding(true);
      setError('');
            
      // Use the shareService function to add the work
      await acceptSharedWork(currentUser.uid, token);
            
      // Reload jobs in the context
      if (reloadJobs) {
        await reloadJobs();
      }
      
      // Navigate to the work list
      navigate('/works');
      
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