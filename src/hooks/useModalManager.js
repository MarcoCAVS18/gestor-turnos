// src/hooks/useModalManager.js

import { useState, useCallback } from 'react';

const useModalManager = () => {
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);

  const openNewWorkModal = useCallback(() => {
    setSelectedWork(null);
    setIsWorkModalOpen(true);
  }, []);

  const openNewShiftModal = useCallback(() => {
    setSelectedShift(null);
    setIsShiftModalOpen(true);
  }, []);

  const openEditWorkModal = useCallback((work) => {
    setSelectedWork(work);
    setIsWorkModalOpen(true);
  }, []);

  const openEditShiftModal = useCallback((shift) => {
    setSelectedShift(shift);
    setIsShiftModalOpen(true);
  }, []);

  const closeWorkModal = useCallback(() => {
    setIsWorkModalOpen(false);
    setSelectedWork(null);
  }, []);

  const closeShiftModal = useCallback(() => {
    setIsShiftModalOpen(false);
    setSelectedShift(null);
  }, []);

  return {
    isWorkModalOpen,
    isShiftModalOpen,
    selectedWork,
    selectedShift,
    openNewWorkModal,
    openNewShiftModal,
    openEditWorkModal,
    openEditShiftModal,
    closeWorkModal,
    closeShiftModal,
  };
};

export default useModalManager;