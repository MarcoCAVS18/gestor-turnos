import React from 'react';
import ***REMOVED*** useTrabajos ***REMOVED*** from '../hooks/useTrabajos';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShareMessages from '../components/work/ShareMessages';
import WorkHeader from '../components/work/WorkHeader';
import WorkEmptyState from '../components/work/WorkEmptyState';
import TarjetaTrabajo from '../components/cards/TarjetaTrabajo';
import TarjetaDelivery from '../components/cards/TarjetaTrabajoDelivery';
import ModalTrabajo from '../components/modals/ModalTrabajo';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import ***REMOVED*** generateWorkDetails ***REMOVED*** from '../utils/workUtils';

const Trabajos = () => ***REMOVED***
  const ***REMOVED***
    loading,
    todosLosTrabajos,
    modalAbierto,
    trabajoSeleccionado,
    thematicColors,
    sharing,
    messages,
    abrirModalNuevo,
    abrirModalEditar,
    cerrarModal,
    handleShareWork,
    deleteManager
  ***REMOVED*** = useTrabajos();

  const tieneTrabajos = todosLosTrabajos.length > 0;

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      <div className="px-4 py-6 pb-32 space-y-6">
        ***REMOVED***/* Mensajes de compartir */***REMOVED***
        <ShareMessages messages=***REMOVED***messages***REMOVED*** />

        ***REMOVED***/* Header */***REMOVED***
        <WorkHeader 
          todosLosTrabajos=***REMOVED***todosLosTrabajos***REMOVED***
          thematicColors=***REMOVED***thematicColors***REMOVED***
          onNuevoTrabajo=***REMOVED***abrirModalNuevo***REMOVED***
        />

        ***REMOVED***/* Contenido principal */***REMOVED***
        ***REMOVED***!tieneTrabajos ? (
          <WorkEmptyState 
            thematicColors=***REMOVED***thematicColors***REMOVED***
            onNuevoTrabajo=***REMOVED***abrirModalNuevo***REMOVED***
          />
        ) : (
          <div className="space-y-4">
            ***REMOVED***todosLosTrabajos.map((trabajo) => ***REMOVED***
              const isSharing = sharing[trabajo.id] || false;

              if (trabajo.tipo === 'delivery') ***REMOVED***
                return (
                  <TarjetaDelivery
                    key=***REMOVED***trabajo.id***REMOVED***
                    trabajo=***REMOVED***trabajo***REMOVED***
                    onEdit=***REMOVED***abrirModalEditar***REMOVED***
                    onDelete=***REMOVED***deleteManager.startDeletion***REMOVED***
                    onShare=***REMOVED***handleShareWork***REMOVED***
                    showActions=***REMOVED***true***REMOVED***
                    isSharing=***REMOVED***isSharing***REMOVED***
                  />
                );
              ***REMOVED***

              return (
                <TarjetaTrabajo
                  key=***REMOVED***trabajo.id***REMOVED***
                  trabajo=***REMOVED***trabajo***REMOVED***
                  onEdit=***REMOVED***abrirModalEditar***REMOVED***
                  onDelete=***REMOVED***deleteManager.startDeletion***REMOVED***
                  onShare=***REMOVED***handleShareWork***REMOVED***
                  showActions=***REMOVED***true***REMOVED***
                  isSharing=***REMOVED***isSharing***REMOVED***
                />
              );
            ***REMOVED***)***REMOVED***
          </div>
        )***REMOVED***
      </div>

      ***REMOVED***/* Modales */***REMOVED***
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
        detalles=***REMOVED***generateWorkDetails(deleteManager.itemToDelete)***REMOVED***
        advertencia=***REMOVED***
          deleteManager.itemToDelete?.tipo === 'delivery'
            ? "Se eliminarán también todos los turnos de delivery asociados a este trabajo."
            : "Se eliminarán también todos los turnos asociados a este trabajo."
        ***REMOVED***
      />
    </LoadingWrapper>
  );
***REMOVED***;

export default Trabajos;