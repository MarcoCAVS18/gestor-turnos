// src/hooks/useShare.js

import { useState, useCallback } from 'react';
import { compartirTrabajoNativo } from '../services/shareService';
import { useAuth } from '../contexts/AuthContext';

export const useShare = () => {
  const { currentUser } = useAuth();
  const [sharing, setSharing] = useState({});
  const [messages, setMessages] = useState({});

  const shareWork = useCallback(async (trabajo) => {
    if (!currentUser || !trabajo) return;

    try {
      setSharing(prev => ({ ...prev, [trabajo.id]: true }));
      setMessages(prev => ({ ...prev, [trabajo.id]: '' }));

      await compartirTrabajoNativo(currentUser.uid, trabajo);

    } catch (error) {
      setMessages(prev => ({
        ...prev,
        [trabajo.id]: 'Error al compartir trabajo'
      }));
      
      setTimeout(() => {
        setMessages(prev => ({ ...prev, [trabajo.id]: '' }));
      }, 3000);
    } finally {
      setSharing(prev => ({ ...prev, [trabajo.id]: false }));
    }
  }, [currentUser]);

  return {
    sharing,
    messages,
    shareWork
  };
};