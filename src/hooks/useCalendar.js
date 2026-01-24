// src/hooks/useCalendar.js

import { useState } from 'react';
import { createSafeDate } from '../utils/time';

export const useCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShiftDate, setNewShiftDate] = useState(null);

  // Function to convert local date to ISO
  const localDateToISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = createSafeDate(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const selectDay = (date) => {
    const dateStr = localDateToISO(date);
    setSelectedDate(dateStr);
  };

  const openNewShiftModal = (date) => {
    const dateISO = localDateToISO(date);
    setNewShiftDate(dateISO);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewShiftDate(null);
  };

  return {
    selectedDate,
    isModalOpen,
    newShiftDate,
    selectDay,
    openNewShiftModal,
    closeModal,
    formatDate,
    localDateToISO
  };
};