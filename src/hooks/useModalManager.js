// src/hooks/useModalManager.js

import ***REMOVED*** useState, useCallback ***REMOVED*** from 'react';

const useModalManager = () => ***REMOVED***
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);

  const openNewWorkModal = useCallback(() => ***REMOVED***
    setSelectedWork(null);
    setIsWorkModalOpen(true);
  ***REMOVED***, []);

  const openNewShiftModal = useCallback(() => ***REMOVED***
    setSelectedShift(null);
    setIsShiftModalOpen(true);
  ***REMOVED***, []);

  const openEditWorkModal = useCallback((work) => ***REMOVED***
    setSelectedWork(work);
    setIsWorkModalOpen(true);
  ***REMOVED***, []);

  const openEditShiftModal = useCallback((shift) => ***REMOVED***
    setSelectedShift(shift);
    setIsShiftModalOpen(true);
  ***REMOVED***, []);

  const closeWorkModal = useCallback(() => ***REMOVED***
    setIsWorkModalOpen(false);
    setSelectedWork(null);
  ***REMOVED***, []);

  const closeShiftModal = useCallback(() => ***REMOVED***
    setIsShiftModalOpen(false);
    setSelectedShift(null);
  ***REMOVED***, []);

  return ***REMOVED***
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
  ***REMOVED***;
***REMOVED***;

export default useModalManager;