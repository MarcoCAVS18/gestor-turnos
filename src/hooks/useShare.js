// src/hooks/useShare.js

import { useState, useCallback } from 'react';
import { shareWorkNative } from '../services/shareService';
import { useAuth } from '../contexts/AuthContext';

export const useShare = () => {
  const { currentUser } = useAuth();
  const [sharing, setSharing] = useState({});
  const [messages, setMessages] = useState({});

  const shareWork = useCallback(async (work) => {
    if (!currentUser || !work) {
      console.error('Cannot share: missing currentUser or work', { currentUser: !!currentUser, work: !!work });
      return;
    }

    try {
      setSharing(prev => ({ ...prev, [work.id]: true }));
      setMessages(prev => ({ ...prev, [work.id]: '' }));

      await shareWorkNative(currentUser.uid, work);

    } catch (error) {
      console.error('Error sharing work:', error);
      setMessages(prev => ({
        ...prev,
        [work.id]: `Error sharing work: ${error.message}`
      }));

      setTimeout(() => {
        setMessages(prev => ({ ...prev, [work.id]: '' }));
      }, 5000);
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