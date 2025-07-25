// src/hooks/useTrabajos.js
import ***REMOVED*** useState, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useShare ***REMOVED*** from './useShare';
import ***REMOVED*** useDeleteManager ***REMOVED*** from './useDeleteManager';

export const useTrabajos = () => ***REMOVED***
  const ***REMOVED***
    trabajos = [], 
    trabajosDelivery = [], 
    loading,
    deleteJob,
    deleteDeliveryJob,
    thematicColors
  ***REMOVED*** = useApp();

  const ***REMOVED*** shareWork, sharing, messages ***REMOVED*** = useShare();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);

  // Combinar todos los trabajos
  const todosLosTrabajos = useMemo(() => ***REMOVED***
    return [...trabajos, ...trabajosDelivery];
  ***REMOVED***, [trabajos, trabajosDelivery]);

  // Función de eliminación
  const handleDeleteTrabajo = async (trabajo) => ***REMOVED***
    try ***REMOVED***
      if (trabajo.tipo === 'delivery') ***REMOVED***
        await deleteDeliveryJob(trabajo.id);
      ***REMOVED*** else ***REMOVED***
        await deleteJob(trabajo.id);
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error eliminando trabajo:', error);
    ***REMOVED***
  ***REMOVED***;

  const deleteManager = useDeleteManager(handleDeleteTrabajo);

  // Función de compartir
  const handleShareWork = async (trabajo) => ***REMOVED***
    try ***REMOVED***
      await shareWork(trabajo);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al compartir trabajo:', error);
    ***REMOVED***
  ***REMOVED***;

  // Funciones de modal
  const abrirModalNuevo = () => ***REMOVED***
    setTrabajoSeleccionado(null);
    setModalAbierto(true);
  ***REMOVED***;

  const abrirModalEditar = (trabajo) => ***REMOVED***
    setTrabajoSeleccionado(trabajo);
    setModalAbierto(true);
  ***REMOVED***;

  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setTrabajoSeleccionado(null);
  ***REMOVED***;

  return ***REMOVED***
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
  ***REMOVED***;
***REMOVED***;
