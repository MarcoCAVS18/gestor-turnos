// src/hooks/useWorks.js

import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useShare } from './useShare';
import { useDeleteManager } from './useDeleteManager';

export const useWorks = () => {
  const {
    works = [], 
    deliveryWork = [], 
    loading,
    deleteJob,
    deleteDeliveryJob,
    thematicColors
  } = useApp();

  const { shareWork, sharing, messages } = useShare();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);

  // Combine all works
  const allWorks = useMemo(() => {
    return [...works, ...deliveryWork];
  }, [works, deliveryWork]);

  // Delete function
  const handleDeleteWork = async (work) => {
    try {
      if (work.type === 'delivery') {
        await deleteDeliveryJob(work.id);
      } else {
        await deleteJob(work.id);
      }
    } catch (error) {
      console.error('Error deleting work:', error);
    }
  };

  const deleteManager = useDeleteManager(handleDeleteWork);

  // Share function
  const handleShareWork = async (work) => {
    try {
      await shareWork(work);
    } catch (error) {
      console.error('Error sharing work:', error);
    }
  };

  // Modal functions
  const openNewModal = () => {
    setSelectedWork(null);
    setIsModalOpen(true);
  };

  const openEditModal = (work) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
  };

  return {
    // States
    loading,
    allWorks,
    isModalOpen,
    selectedWork,
    thematicColors,
    sharing,
    messages,

    // Functions
    openNewModal,
    openEditModal,
    closeModal,
    handleShareWork,
    
    // Delete manager
    deleteManager
  };
};
