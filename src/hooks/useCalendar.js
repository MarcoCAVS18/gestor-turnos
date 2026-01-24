// src/hooks/useCalendar.js

import ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';

export const useCalendar = () => ***REMOVED***
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShiftDate, setNewShiftDate] = useState(null);

  // Function to convert local date to ISO
  const localDateToISO = (date) => ***REMOVED***
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
  ***REMOVED***;

  // Format date for display
  const formatDate = (dateStr) => ***REMOVED***
    const date = createSafeDate(dateStr);
    return date.toLocaleDateString('en-US', ***REMOVED***
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    ***REMOVED***);
  ***REMOVED***;

  const selectDay = (date) => ***REMOVED***
    const dateStr = localDateToISO(date);
    setSelectedDate(dateStr);
  ***REMOVED***;

  const openNewShiftModal = (date) => ***REMOVED***
    const dateISO = localDateToISO(date);
    setNewShiftDate(dateISO);
    setIsModalOpen(true);
  ***REMOVED***;

  const closeModal = () => ***REMOVED***
    setIsModalOpen(false);
    setNewShiftDate(null);
  ***REMOVED***;

  return ***REMOVED***
    selectedDate,
    isModalOpen,
    newShiftDate,
    selectDay,
    openNewShiftModal,
    closeModal,
    formatDate,
    localDateToISO
  ***REMOVED***;
***REMOVED***;