// src/hooks/useShiftManager.js

import ***REMOVED*** useState ***REMOVED*** from 'react';

export const useTurnManager = () => ***REMOVED***
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [initialDate, setInitialDate] = useState(null);

  const openNewModal = () => ***REMOVED***
    setSelectedShift(null);
    setInitialDate(null);
    setIsModalOpen(true);
  ***REMOVED***;

  const openEditModal = (shift) => ***REMOVED***
    setSelectedShift(shift);
    setInitialDate(null);
    setIsModalOpen(true);
  ***REMOVED***;

  const openModalWithDate = (date) => ***REMOVED***
    setSelectedShift(null);
    setInitialDate(date);
    setIsModalOpen(true);
  ***REMOVED***;

  const closeModal = () => ***REMOVED***
    setIsModalOpen(false);
    setSelectedShift(null);
    setInitialDate(null);
  ***REMOVED***;

  return ***REMOVED***
    isModalOpen,
    selectedShift,
    initialDate,
    openNewModal,
    openEditModal,
    openModalWithDate,
    closeModal
  ***REMOVED***;
***REMOVED***;