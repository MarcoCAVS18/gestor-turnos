// src/hooks/useShare.js

import { useState, useCallback } from 'react';
import { shareWorkNative } from '../services/shareService';
import { useAuth } from '../contexts/AuthContext';

export const useShare = () => {
  const { currentUser } = useAuth();
  const [sharing, setSharing] = useState({});
  const [messages, setMessages] = useState({});

  const shareWork = useCallback(async (work) => {
    if (!currentUser || !work) return;

    try {
      setSharing(prev => ({ ...prev, [work.id]: true }));
      setMessages(prev => ({ ...prev, [work.id]: '' }));

      await shareWorkNative(currentUser.uid, work);

    } catch (error) {
      setMessages(prev => ({
        ...prev,
        [work.id]: 'Error sharing work'
      }));
      
      setTimeout(() => {
        setMessages(prev => ({ ...prev, [work.id]: '' }));
      }, 3000);
    } finally {
      setSharing(prev => ({ ...prev, [work.id]: false }));
    }
  }, [currentUser]);

  return {
    sharing,
    messages,
    shareWork
  };
};