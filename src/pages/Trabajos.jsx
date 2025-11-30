// src/pages/Trabajos.jsx - Versión mejorada con layout en columnas

import React from 'react';
import ***REMOVED*** useTrabajos ***REMOVED*** from '../hooks/useTrabajos';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShareMessages from '../components/work/ShareMessages';
import PageHeader from '../components/layout/PageHeader'; // Added import
import ***REMOVED*** Briefcase, Plus ***REMOVED*** from 'lucide-react'; // Added icons
import WorkEmptyState from '../components/work/WorkEmptyState';
import TarjetaTrabajo from '../components/cards/work/TarjetaTrabajo';
import TarjetaDelivery from '../components/cards/work/TarjetaTrabajoDelivery';
import ModalTrabajo from '../components/modals/work/ModalTrabajo';
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

  // Separar trabajos tradicionales y de delivery
  const trabajosTradicionales = todosLosTrabajos.filter(trabajo => trabajo.tipo !== 'delivery');
  const trabajosDelivery = todosLosTrabajos.filter(trabajo => trabajo.tipo === 'delivery');

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      <div className="px-4 py-6 pb-32 space-y-6">
        ***REMOVED***/* Mensajes de compartir */***REMOVED***
        <ShareMessages messages=***REMOVED***messages***REMOVED*** />

        ***REMOVED***/* Header */***REMOVED***
        <PageHeader
          title="Trabajos"
          subtitle="Administra tus diferentes trabajos o empleos."
          icon=***REMOVED***Briefcase***REMOVED***
          action=***REMOVED******REMOVED*** onClick: abrirModalNuevo, icon: Plus, label: 'Nuevo Trabajo' ***REMOVED******REMOVED***
        />

        ***REMOVED***/* Contenido principal */***REMOVED***
        ***REMOVED***!tieneTrabajos ? (
          <WorkEmptyState 
            onNuevoTrabajo=***REMOVED***abrirModalNuevo***REMOVED***
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            ***REMOVED***/* Trabajos Tradicionales */***REMOVED***
            ***REMOVED***trabajosTradicionales.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div 
                    className="w-1 h-6 rounded-full mr-3"
                    style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.primary || '#EC4899' ***REMOVED******REMOVED***
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Trabajos Tradicionales
                  </h2>
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    ***REMOVED***trabajosTradicionales.length***REMOVED***
                  </span>
                </div>
                
                ***REMOVED***/* Layout en columnas para trabajos tradicionales */***REMOVED***
                <div className="space-y-4">
                  ***REMOVED***trabajosTradicionales.map((trabajo) => ***REMOVED***
                    const isSharing = sharing[trabajo.id] || false;
                    
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
              </div>
            )***REMOVED***

            ***REMOVED***/* Trabajos de Delivery */***REMOVED***
            ***REMOVED***trabajosDelivery.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div 
                    className="w-1 h-6 rounded-full mr-3"
                    style=***REMOVED******REMOVED*** backgroundColor: '#10B981' ***REMOVED******REMOVED***
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Trabajos de Delivery
                  </h2>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    ***REMOVED***trabajosDelivery.length***REMOVED***
                  </span>
                </div>
                
                ***REMOVED***/* Layout en columnas para trabajos de delivery */***REMOVED***
                <div className="space-y-4">
                  ***REMOVED***trabajosDelivery.map((trabajo) => ***REMOVED***
                    const isSharing = sharing[trabajo.id] || false;
                    
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
                  ***REMOVED***)***REMOVED***
                </div>
              </div>
            )***REMOVED***
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