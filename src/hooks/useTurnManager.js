// src/hooks/useShiftManager.js

import { useState } from 'react';

export const useTurnManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [initialDate, setInitialDate] = useState(null);

  const openNewModal = () => {
    setSelectedShift(null);
    setInitialDate(null);
    setIsModalOpen(true);
  };

  const openEditModal = (shift) => {
    setSelectedShift(shift);
    setInitialDate(null);
    setIsModalOpen(true);
  };

  const openModalWithDate = (date) => {
    setSelectedShift(null);
    setInitialDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShift(null);
    setInitialDate(null);
  };

  return {
    isModalOpen,
    selectedShift,
    initialDate,
    openNewModal,
    openEditModal,
    openModalWithDate,
    closeModal
  };
};