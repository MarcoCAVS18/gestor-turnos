// src/hooks/useDeleteManager.js

import { useState } from 'react';
import logger from '../utils/logger';

export const useDeleteManager = (deleteFunction) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const startDeletion = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const cancelDeletion = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const confirmDeletion = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      await deleteFunction(itemToDelete);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      logger.error('Error in deleteManager:', error);
      throw error; // Re-throw to allow parent to handle
    } finally {
      setDeleting(false);
    }
  };

  return {
    showDeleteModal,
    itemToDelete,
    deleting,
    startDeletion,
    cancelDeletion,
    confirmDeletion
  };
};