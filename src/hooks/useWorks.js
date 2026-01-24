// src/hooks/useWorks.js

import ***REMOVED*** useState, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useShare ***REMOVED*** from './useShare';
import ***REMOVED*** useDeleteManager ***REMOVED*** from './useDeleteManager';

export const useWorks = () => ***REMOVED***
  const ***REMOVED***
    works = [], 
    deliveryWorks = [], 
    loading,
    deleteJob,
    deleteDeliveryJob,
    thematicColors
  ***REMOVED*** = useApp();

  const ***REMOVED*** shareWork, sharing, messages ***REMOVED*** = useShare();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);

  // Combine all works
  const allWorks = useMemo(() => ***REMOVED***
    return [...works, ...deliveryWorks];
  ***REMOVED***, [works, deliveryWorks]);

  // Delete function
  const handleDeleteWork = async (work) => ***REMOVED***
    try ***REMOVED***
      if (work.type === 'delivery') ***REMOVED***
        await deleteDeliveryJob(work.id);
      ***REMOVED*** else ***REMOVED***
        await deleteJob(work.id);
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error deleting work:', error);
    ***REMOVED***
  ***REMOVED***;

  const deleteManager = useDeleteManager(handleDeleteWork);

  // Share function
  const handleShareWork = async (work) => ***REMOVED***
    try ***REMOVED***
      await shareWork(work);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error sharing work:', error);
    ***REMOVED***
  ***REMOVED***;

  // Modal functions
  const openNewModal = () => ***REMOVED***
    setSelectedWork(null);
    setIsModalOpen(true);
  ***REMOVED***;

  const openEditModal = (work) => ***REMOVED***
    setSelectedWork(work);
    setIsModalOpen(true);
  ***REMOVED***;

  const closeModal = () => ***REMOVED***
    setIsModalOpen(false);
    setSelectedWork(null);
  ***REMOVED***;

  return ***REMOVED***
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
  ***REMOVED***;
***REMOVED***;
