// src/hooks/useWorks.js

import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useShare } from './useShare';
import { useDeleteManager } from './useDeleteManager';
import logger from '../utils/logger';

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
  const [defaultWorkType, setDefaultWorkType] = useState(null);

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
      logger.error('Error deleting work:', error);
    }
  };

  const deleteManager = useDeleteManager(handleDeleteWork);

  // Share function
  const handleShareWork = async (work) => {
    try {
      await shareWork(work);
    } catch (error) {
      logger.error('Error sharing work:', error);
    }
  };

  // Modal functions
  // type: 'traditional' | 'delivery' | null (null shows selector)
  const openNewModal = (type = null) => {
    setSelectedWork(null);
    setDefaultWorkType(type);
    setIsModalOpen(true);
  };

  const openEditModal = (work) => {
    setSelectedWork(work);
    setDefaultWorkType(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
    setDefaultWorkType(null);
  };

  return {
    // States
    loading,
    allWorks,
    isModalOpen,
    selectedWork,
    defaultWorkType,
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
