// src/hooks/useDeleteManager.js

import ***REMOVED*** useState ***REMOVED*** from 'react';

export const useDeleteManager = (deleteFunction) => ***REMOVED***
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const startDeletion = (item) => ***REMOVED***
    setItemToDelete(item);
    setShowDeleteModal(true);
  ***REMOVED***;

  const cancelDeletion = () => ***REMOVED***
    setShowDeleteModal(false);
    setItemToDelete(null);
  ***REMOVED***;

  const confirmDeletion = async () => ***REMOVED***
    if (!itemToDelete) return;
    
    setDeleting(true);
    try ***REMOVED***
      await deleteFunction(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
    ***REMOVED*** catch (error) ***REMOVED***
      // Error ya manejado en el contexto
    ***REMOVED*** finally ***REMOVED***
      setDeleting(false);
    ***REMOVED***
  ***REMOVED***;

  return ***REMOVED***
    showDeleteModal,
    itemToDelete,
    deleting,
    startDeletion,
    cancelDeletion,
    confirmDeletion
  ***REMOVED***;
***REMOVED***;