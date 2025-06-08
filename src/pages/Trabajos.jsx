// src/pages/Trabajos.jsx

import React from 'react';
import ***REMOVED*** PlusCircle, Briefcase ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import TarjetaTrabajo from '../components/cards/TarjetaTrabajo';
import ModalTrabajo from '../components/modals/ModalTrabajo';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ListSection from '../components/sections/ListSection';

const Trabajos = () => ***REMOVED***
  const ***REMOVED*** trabajos, cargando, borrarTrabajo ***REMOVED*** = useApp();
  const deleteManager = useDeleteManager(borrarTrabajo);
  
  // Estado para modales
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState(null);

  // Funciones para manejar modales
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

  return (
    <LoadingWrapper loading=***REMOVED***cargando***REMOVED***>
      <ListSection
        title="Mis Trabajos"
        action=***REMOVED******REMOVED***
          label: 'Nuevo Trabajo',
          icon: PlusCircle,
          onClick: abrirModalNuevo
        ***REMOVED******REMOVED***
        items=***REMOVED***trabajos***REMOVED***
        emptyState=***REMOVED******REMOVED***
          icon: Briefcase,
          title: 'No hay trabajos registrados',
          description: 'Comienza agregando tu primer trabajo',
          action: ***REMOVED***
            label: 'Agregar primer trabajo',
            icon: PlusCircle,
            onClick: abrirModalNuevo
          ***REMOVED***
        ***REMOVED******REMOVED***
        renderItem=***REMOVED***(trabajo) => (
          <TarjetaTrabajo
            key=***REMOVED***trabajo.id***REMOVED***
            trabajo=***REMOVED***trabajo***REMOVED***
            onEdit=***REMOVED***abrirModalEditar***REMOVED***
            onDelete=***REMOVED***deleteManager.startDeletion***REMOVED***
            showActions=***REMOVED***true***REMOVED***
          />
        )***REMOVED***
        className="space-y-4"
      />

      <ModalTrabajo 
        isOpen=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        trabajo=***REMOVED***trabajoSeleccionado***REMOVED*** 
      />
      
      <AlertaEliminacion
        visible=***REMOVED***deleteManager.showDeleteModal***REMOVED***
        onCancel=***REMOVED***deleteManager.cancelDeletion***REMOVED***
        onConfirm=***REMOVED***deleteManager.confirmDeletion***REMOVED***
        eliminando=***REMOVED***deleteManager.deleting***REMOVED***
        tipo="trabajo"
        detalles=***REMOVED***deleteManager.itemToDelete ? [deleteManager.itemToDelete.nombre] : []***REMOVED***
      />
    </LoadingWrapper>
  );
***REMOVED***;

export default Trabajos;