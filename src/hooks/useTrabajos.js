// src/hooks/useTrabajos.js
import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useShare } from './useShare';
import { useDeleteManager } from './useDeleteManager';

export const useTrabajos = () => {
  const {
    trabajos = [], 
    trabajosDelivery = [], 
    loading,
    deleteJob,
    deleteDeliveryJob,
    thematicColors
  } = useApp();

  const { shareWork, sharing, messages } = useShare();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);

  // Combinar todos los trabajos
  const todosLosTrabajos = useMemo(() => {
    return [...trabajos, ...trabajosDelivery];
  }, [trabajos, trabajosDelivery]);

  // Función de eliminación
  const handleDeleteTrabajo = async (trabajo) => {
    try {
      if (trabajo.tipo === 'delivery') {
        await deleteDeliveryJob(trabajo.id);
      } else {
        await deleteJob(trabajo.id);
      }
    } catch (error) {
      console.error('Error eliminando trabajo:', error);
    }
  };

  const deleteManager = useDeleteManager(handleDeleteTrabajo);

  // Función de compartir
  const handleShareWork = async (trabajo) => {
    try {
      await shareWork(trabajo);
    } catch (error) {
      console.error('Error al compartir trabajo:', error);
    }
  };

  // Funciones de modal
  const abrirModalNuevo = () => {
    setTrabajoSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTrabajoSeleccionado(null);
  };

  return {
    // Estados
    loading,
    todosLosTrabajos,
    modalAbierto,
    trabajoSeleccionado,
    thematicColors,
    sharing,
    messages,

    // Funciones
    abrirModalNuevo,
    abrirModalEditar,
    cerrarModal,
    handleShareWork,
    
    // Delete manager
    deleteManager
  };
};
