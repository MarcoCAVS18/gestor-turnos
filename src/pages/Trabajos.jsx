// src/pages/Trabajos.jsx - Versión mejorada con layout en columnas

import React from 'react';
import { useTrabajos } from '../hooks/useTrabajos';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShareMessages from '../components/work/ShareMessages';
import WorkHeader from '../components/work/WorkHeader';
import WorkEmptyState from '../components/work/WorkEmptyState';
import TarjetaTrabajo from '../components/cards/TarjetaTrabajo';
import TarjetaDelivery from '../components/cards/TarjetaTrabajoDelivery';
import ModalTrabajo from '../components/modals/ModalTrabajo';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import { generateWorkDetails } from '../utils/workUtils';

const Trabajos = () => {
  const {
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
  } = useTrabajos();

  const tieneTrabajos = todosLosTrabajos.length > 0;

  // Separar trabajos tradicionales y de delivery
  const trabajosTradicionales = todosLosTrabajos.filter(trabajo => trabajo.tipo !== 'delivery');
  const trabajosDelivery = todosLosTrabajos.filter(trabajo => trabajo.tipo === 'delivery');

  return (
    <LoadingWrapper loading={loading}>
      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Mensajes de compartir */}
        <ShareMessages messages={messages} />

        {/* Header */}
        <WorkHeader 
          todosLosTrabajos={todosLosTrabajos}
          onNuevoTrabajo={abrirModalNuevo}
        />

        {/* Contenido principal */}
        {!tieneTrabajos ? (
          <WorkEmptyState 
            onNuevoTrabajo={abrirModalNuevo}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trabajos Tradicionales */}
            {trabajosTradicionales.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div 
                    className="w-1 h-6 rounded-full mr-3"
                    style={{ backgroundColor: thematicColors?.primary || '#EC4899' }}
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Trabajos Tradicionales
                  </h2>
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {trabajosTradicionales.length}
                  </span>
                </div>
                
                {/* Layout en columnas para trabajos tradicionales */}
                <div className="space-y-4">
                  {trabajosTradicionales.map((trabajo) => {
                    const isSharing = sharing[trabajo.id] || false;
                    
                    return (
                      <TarjetaTrabajo
                        key={trabajo.id}
                        trabajo={trabajo}
                        onEdit={abrirModalEditar}
                        onDelete={deleteManager.startDeletion}
                        onShare={handleShareWork}
                        showActions={true}
                        isSharing={isSharing}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trabajos de Delivery */}
            {trabajosDelivery.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div 
                    className="w-1 h-6 rounded-full mr-3"
                    style={{ backgroundColor: '#10B981' }}
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Trabajos de Delivery
                  </h2>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    {trabajosDelivery.length}
                  </span>
                </div>
                
                {/* Layout en columnas para trabajos de delivery */}
                <div className="space-y-4">
                  {trabajosDelivery.map((trabajo) => {
                    const isSharing = sharing[trabajo.id] || false;
                    
                    return (
                      <TarjetaDelivery
                        key={trabajo.id}
                        trabajo={trabajo}
                        onEdit={abrirModalEditar}
                        onDelete={deleteManager.startDeletion}
                        onShare={handleShareWork}
                        showActions={true}
                        isSharing={isSharing}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modales */}
      <ModalTrabajo
        isOpen={modalAbierto}
        onClose={cerrarModal}
        trabajo={trabajoSeleccionado}
      />

      <AlertaEliminacion
        visible={deleteManager.showDeleteModal}
        onCancel={deleteManager.cancelDeletion}
        onConfirm={deleteManager.confirmDeletion}
        eliminando={deleteManager.deleting}
        tipo="trabajo"
        detalles={generateWorkDetails(deleteManager.itemToDelete)}
        advertencia={
          deleteManager.itemToDelete?.tipo === 'delivery'
            ? "Se eliminarán también todos los turnos de delivery asociados a este trabajo."
            : "Se eliminarán también todos los turnos asociados a este trabajo."
        }
      />
    </LoadingWrapper>
  );
};

export default Trabajos;